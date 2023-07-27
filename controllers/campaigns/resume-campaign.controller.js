const HttpMethod = require("@/constants/HttpMethod");
const AuthenticationMiddleware = require("@/middleware/authentication");
const verifyIntegration = require("@/middleware/verifyIntegration");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");
const { default: axios } = require("axios");

class ResumeCampaignController extends WebController {
  constructor() {
    super("/:campaignId/actions/resume", HttpMethod.POST, [
      AuthenticationMiddleware,
      verifyIntegration.mailchimp,
    ]);
  }

  async handler(req, res) {
    try {
      const { profile } = res.locals.integration.payload;
      const { campaignId } = req.params;
      const { accessToken, api_endpoint } = profile;
      const { MAILCHIMP_API_VERSION } = process.env;

      await axios.post(
        `${api_endpoint}/${MAILCHIMP_API_VERSION}/campaigns/${campaignId}/actions/resume`,
        null,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      return res
        .status(200)
        .json(success(`RSS Campaign ${campaignId} has been resumed`));
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new ResumeCampaignController();
