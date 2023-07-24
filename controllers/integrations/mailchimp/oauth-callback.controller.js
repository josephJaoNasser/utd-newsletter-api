const HttpMethod = require("@/constants/HttpMethod");
const User = require("@/models/User");
const { decryptText } = require("@/utils/encryption");
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
      const { uid, direct, mini } = JSON.parse(req.query.state);
      const user = await User.findById(uid);
      const token = decryptText(user.token);
      const { OAUTH_SUCCESS_URL, OAUTH_SUCCESS_URL_MINI } = process.env;

      let successUrl = mini ? OAUTH_SUCCESS_URL_MINI : OAUTH_SUCCESS_URL;

      if (direct) {
        successUrl += `?uid=${uid}&access_token=${token}`;
      }

      return res.redirect(`${successUrl}`);
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new CreateIntegrationController();
