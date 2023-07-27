const HttpMethod = require("@/constants/HttpMethod");
const User = require("@/models/User");
const { decryptText } = require("@/utils/encryption");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");
const passport = require("passport");

class CreateIntegrationController extends WebController {
  constructor() {
    super("/oauth/callback", HttpMethod.GET, [
      passport.authenticate("mailchimp", {
        failureRedirect: "/?success=false&prompt_mailchimp=true",
      }),
    ]);
  }

  async handler(req, res) {
    try {
      const { uid, direct, mini } = JSON.parse(req.query.state);
      const { integration, user } = req.session.passport.user;
      const { OAUTH_SUCCESS_URL, OAUTH_SUCCESS_URL_MINI } = process.env;
      let query = {
        uid,
      };

      let successUrl = mini ? OAUTH_SUCCESS_URL_MINI : OAUTH_SUCCESS_URL;

      if (direct) {
        const token = decryptText(user.token);
        query.token = token;
      }

      query.mailchimpToken = integration.payload.accessToken;
      query.mailchimpId = integration.payload.profile.id;

      const parsedQuery = "?" + new URLSearchParams(query).toString();

      return res.redirect(`${successUrl}${parsedQuery}`);
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new CreateIntegrationController();
