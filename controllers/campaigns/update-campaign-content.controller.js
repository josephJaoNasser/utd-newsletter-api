const HttpMethod = require("@/constants/HttpMethod");
const AuthenticationMiddleware = require("@/middleware/authentication");
const verifyIntegration = require("@/middleware/verifyIntegration");
const CampaignEmails = require("@/models/CampaignEmails");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");
const { default: axios } = require("axios");

class UpdateCampaignContentController extends WebController {
  constructor() {
    super("/:campaignId/content", HttpMethod.PUT, [
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
      const { html, revolvappMarkup, postAssignments } = req.body;
      const payload = {
        campaignId,
        html,
        revolvappMarkup,
        postAssignments,
      };

      let campaignEmail = await CampaignEmails.findOne({
        campaignId,
      });

      if (!campaignEmail) {
        const newCampaignEmail = new CampaignEmails(payload);
        campaignEmail = await newCampaignEmail.save();
      } else {
        campaignEmail = await CampaignEmails.findByIdAndUpdate(
          campaignEmail._id,
          payload
        );
      }

      const { data: content } = await axios.put(
        `${api_endpoint}/${MAILCHIMP_API_VERSION}/campaigns/${campaignId}/content`,
        {
          html,
        },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      return res.status(200).json(success({ campaignEmail, content }));
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new UpdateCampaignContentController();
