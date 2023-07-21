const HttpMethod = require("@/constants/HttpMethod");
const AuthenticationMiddleware = require("@/middleware/authentication");
const verifyIntegration = require("@/middleware/verifyIntegration");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");
const { default: axios } = require("axios");

class CreateCampaignController extends WebController {
  constructor() {
    super("/", HttpMethod.POST, [
      AuthenticationMiddleware,
      verifyIntegration.mailchimp,
    ]);
  }

  async handler(req, res) {
    try {
      const { profile } = res.locals.integration.payload;
      const { accessToken, api_endpoint } = profile;
      const { MAILCHIMP_API_VERSION } = process.env;

      const { data: campaign } = await axios.post(
        `${api_endpoint}/${MAILCHIMP_API_VERSION}/campaigns`,
        req.body,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      return res.status(200).json(success({ campaign }));
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new CreateCampaignController();
