const HttpMethod = require("@/constants/HttpMethod");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");
const passport = require("passport");

class CreateIntegrationController extends WebController {
  constructor() {
    super("/oauth/callback", HttpMethod.GET, [
      passport.authenticate("mailchimp", { failureRedirect: "/" }),
    ]);
  }

  async handler(req, res) {
    try {
      return res.redirect(process.env.OAUTH_SUCCESS_URL);
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new CreateIntegrationController();
