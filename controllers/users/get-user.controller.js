const HttpMethod = require("@/constants/HttpMethod");
const AuthenticationMiddleware = require("@/middleware/authentication");
const verifyIntegration = require("@/middleware/verifyIntegration");
const Integration = require("@/models/Integration");
const User = require("@/models/User");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");

class GetUserController extends WebController {
  constructor() {
    super("/:userId", HttpMethod.GET, [AuthenticationMiddleware]);
  }

  async handler(req, res) {
    try {
      const { userId } = req.params;
      const { access_token } = res.locals;

      if (!access_token) {
        return res
          .status(401)
          .send(failed("You do not have permission to access the users' data"));
      }

      const user = await User.findById(userId);
      const mailchimpAccounts = await Integration.find({
        userId,
        service: "mailchimp",
      });

      if (!user) {
        return res.status(404).send(failed("Failed to get user"));
      }

      return res.status(200).send({
        user,
        mailchimpAccounts: mailchimpAccounts.map((acct) => acct.payload),
      });
    } catch (err) {
      console.log(err);
      res.status(getErrorCode(err)).send(failed(err));
    }
  }
}

module.exports = new GetUserController();
