const HttpMethod = require("@/constants/HttpMethod");
const AuthenticationMiddleware = require("@/middleware/authentication");
const verifyIntegration = require("@/middleware/verifyIntegration");
const CampaignEmails = require("@/models/CampaignEmails");
const ScheduledCampaigns = require("@/models/ScheduledCampaigns");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");
const { default: axios } = require("axios");

class GetCampaignController extends WebController {
  constructor() {
    super("/:campaignId", HttpMethod.GET, [
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
      const apiEndpoint = `${api_endpoint}/${MAILCHIMP_API_VERSION}`;
      const config = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      const campaignDetails = await axios.get(
        `${apiEndpoint}/campaigns/${campaignId}`,
        config
      );

      // get campaign schedule
      const isScheduled = await ScheduledCampaigns.findOne({
        campaign_id: campaignId,
      });

      // get campaign segments
      const campaignSegments = await axios.get(
        `${apiEndpoint}/lists/${campaignDetails.data.recipients.list_id}/segments`,
        config
      );

      // get campaign content
      const campaignContent = await axios.get(
        `${apiEndpoint}/campaigns/${req.params.campaignId}/content`,
        config
      );

      // add campaign segments
      if (
        campaignDetails.data.recipients.segment_opts &&
        campaignDetails.data.recipients.segment_opts.saved_segment_id
      ) {
        const segmentDetails = campaignSegments.data.segments.find(
          (segment) =>
            segment.id ===
            campaignDetails.data.recipients.segment_opts.saved_segment_id
        );

        campaignDetails.data.recipients.segment_opts.saved_segment = {
          id: segmentDetails.id,
          name: segmentDetails.name,
          member_count: segmentDetails.member_count,
        };

        delete campaignDetails.data.recipients.segment_opts.saved_segment_id;
      }

      campaignDetails.data.recipients.segments =
        campaignSegments.data.segments.map((segment) => ({
          id: segment.id,
          name: segment.name,
          member_count: segment.member_count,
          created_at: segment.created_at,
          updated_at: segment.updated_at,
        }));

      campaignDetails.data.content = campaignContent.data;

      return res.status(200).json(
        success({
          campaign: {
            ...campaignDetails.data,
            status: isScheduled ? "schedule" : campaignDetails.data.status,
            schedule_time: isScheduled ? isScheduled.schedule_time : null,
          },
        })
      );
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new GetCampaignController();
