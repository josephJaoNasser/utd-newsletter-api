const HttpMethod = require("@/constants/HttpMethod");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");
const User = require("@/models/User");
const passport = require("passport");
const AuthenticationMiddleware = require("@/middleware/authentication");

class MailchimpOauthController extends WebController {
  constructor() {
    super("/oauth", HttpMethod.GET, [
      // AuthenticationMiddleware
    ]);
  }

  async handler(req, res) {
    if (!req.query.userId?.length) {
      return res.status(401).send(failed("UTD user ID not provided"));
    }

    try {
      const user = await User.findOne({ userId: req.query.userId });

      if (!user) {
        return res
          .status(403)
          .send(
            failed(
              "The user with the id " +
                req.query.userId +
                " has not activated their account with the Project management app yet"
            )
          );
      }

      passport.authenticate("mailchimp", {
        state: JSON.stringify({
          utdId: user.userId,
          uid: user._id,
        }),
      })(req, res);
    } catch (e) {
      console.log(e);
      return res.status(404).send(failed(e));
    }
  }
}

module.exports = new MailchimpOauthController();
