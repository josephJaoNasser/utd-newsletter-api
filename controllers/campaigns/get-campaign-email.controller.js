const HttpMethod = require("@/constants/HttpMethod");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");
const AuthenticationMiddleware = require("@/middleware/authentication");
const CampaignEmails = require("@/models/CampaignEmails");

class IndexController extends WebController {
  constructor() {
    super("/:campaignId/email", HttpMethod.GET, [AuthenticationMiddleware]);
  }

  async handler(req, res) {
    try {
      const { campaignId } = req.params;
      const campaignEmail = await CampaignEmails.findOne({
        campaignId,
      });

      if (!campaignEmail) {
        return res.status(404).json(failed("No email saved for this campaign"));
      }

      return res.status(200).json(
        success({
          campaignEmail,
        })
      );
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new IndexController();
