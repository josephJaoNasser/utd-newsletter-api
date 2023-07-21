const HttpMethod = require("@/constants/HttpMethod");
const AuthenticationMiddleware = require("@/middleware/authentication");
const verifyIntegration = require("@/middleware/verifyIntegration");
const ScheduledCampaigns = require("@/models/ScheduledCampaigns");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");
const { default: axios } = require("axios");

class ScheduleCampaignController extends WebController {
  constructor() {
    super("/:campaignId/actions/schedule", HttpMethod.POST, [
      AuthenticationMiddleware,
      verifyIntegration.mailchimp,
    ]);
  }

  async handler(req, res) {
    try {
      const { profile } = res.locals.integration.payload;
      const { schedule_time, batch_delivery, timewarp } = req.body;
      const { MAILCHIMP_API_VERSION } = process.env;
      const { accessToken, api_endpoint } = profile;

      if (!schedule_time) {
        return res.status(400).json(failed("Invalid date and time"));
      }

      const { data: campaign } = await axios.get(
        `${api_endpoint}/${MAILCHIMP_API_VERSION}/campaigns/${req.params.campaignId}`,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      if (!campaign) {
        return res.status(getErrorCode(err)).json(failed(err));
      }

      const payload = {
        campaign_id: req.params.campaignId,
        schedule_time,
        batch_delivery,
        timewarp,
      };

      const duplicateSchedule = await ScheduledCampaigns.findOne({
        campaign_id: payload.campaign_id,
      });

      if (duplicateSchedule) {
        await ScheduledCampaigns.findByIdAndUpdate(
          duplicateSchedule._id,
          payload
        );
      } else {
        const newSchedule = new ScheduledCampaigns(payload);
        await newSchedule.save();
      }

      return res
        .status(200)
        .json(success(`Campaign ${req.params.campaignId} has been scheduled!`));
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new ScheduleCampaignController();
