const HttpMethod = require("@/constants/HttpMethod");
const AuthenticationMiddleware = require("@/middleware/authentication");
const verifyIntegration = require("@/middleware/verifyIntegration");
const ScheduledCampaigns = require("@/models/ScheduledCampaigns");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");
const { default: axios } = require("axios");

class UnscheduleCampaignController extends WebController {
  constructor() {
    super("/:campaignId/actions/unschedule", HttpMethod.POST, [
      AuthenticationMiddleware,
      verifyIntegration.mailchimp,
    ]);
  }

  async handler(req, res) {
    try {
      const { campaignId } = req.params;

      const scheduledCampaigns = await ScheduledCampaigns.find({
        campaign_id: campaignId,
      });

      if (!scheduledCampaigns?.length) {
        return res
          .status(200)
          .json(
            success({ message: "This campaign has already been unscheduled." })
          );
      }

      await ScheduledCampaigns.deleteMany({
        campaign_id: campaignId,
      });

      return res
        .status(200)
        .json(
          success(`Campaign ${req.params.campaignId} has been unscheduled.`)
        );
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new UnscheduleCampaignController();
