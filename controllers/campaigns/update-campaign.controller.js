const HttpMethod = require("@/constants/HttpMethod");
const AuthenticationMiddleware = require("@/middleware/authentication");
const verifyIntegration = require("@/middleware/verifyIntegration");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");
const { default: axios } = require("axios");

class UpdateCampaignController extends WebController {
  constructor() {
    super("/:campaignId", HttpMethod.PATCH, [
      AuthenticationMiddleware,
      verifyIntegration.mailchimp,
    ]);
  }

  async handler(req, res) {
    try {
      const { profile } = res.locals.integration.payload;
      const { accessToken, api_endpoint } = profile;
      const { MAILCHIMP_API_VERSION } = process.env;
      const { campaignId } = req.params;

      const { data: updatedCampaign } = await axios.patch(
        `${api_endpoint}/${MAILCHIMP_API_VERSION}/campaigns/${campaignId}`,
        req.body,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      const campaignSegments = await axios.get(
        `${api_endpoint}/${MAILCHIMP_API_VERSION}/lists/${updatedCampaign.recipients.list_id}/segments`,
        {
          headers: {
            Authorization: bearerToken,
          },
        }
      );

      if (
        updatedCampaign.recipients.segment_opts &&
        updatedCampaign.recipients.segment_opts.saved_segment_id
      ) {
        const segmentDetails = campaignSegments.data.segments.find(
          (segment) =>
            segment.id ===
            updatedCampaign.recipients.segment_opts.saved_segment_id
        );

        updatedCampaign.recipients.segment_opts.saved_segment = {
          id: segmentDetails.id,
          name: segmentDetails.name,
          member_count: segmentDetails.member_count,
        };

        delete updatedCampaign.recipients.segment_opts.saved_segment_id;
      }

      const campaignContent = await axios.get(
        `${api_endpoint}/${MAILCHIMP_API_VERSION}/campaigns/${campaignId}/content`,
        {
          headers: {
            Authorization: bearerToken,
          },
        }
      );

      updatedCampaign.recipients.segments = campaignSegments.data.segments.map(
        (segment) => ({
          id: segment.id,
          name: segment.name,
          member_count: segment.member_count,
          created_at: segment.created_at,
          updated_at: segment.updated_at,
        })
      );

      updatedCampaign.content = campaignContent.data;

      return res.status(200).json(success({ campaign: updatedCampaign }));
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new UpdateCampaignController();
