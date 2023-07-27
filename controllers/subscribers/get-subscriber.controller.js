const HttpMethod = require("@/constants/HttpMethod");
const AuthenticationMiddleware = require("@/middleware/authentication");
const verifyIntegration = require("@/middleware/verifyIntegration");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");

class IndexController extends WebController {
  constructor() {
    super("/:id", HttpMethod.GET, [
      AuthenticationMiddleware,
      verifyIntegration.mailchimp,
    ]);
  }

  async handler(req, res) {
    try {
      const { profile } = res.locals.integration.payload;
      const { accessToken, api_endpoint } = profile;
      const { MAILCHIMP_API_VERSION } = process.env;

      const mailchimpLists = await axios.get(
        `${api_endpoint}/${MAILCHIMP_API_VERSION}/lists`,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      const listId = mailchimpLists.data.lists[0].id;

      const subscriberDetails = await axios.get(
        `${apiEndpoint}/lists/${listId}/members/${req.params.id}`,
        {
          headers: {
            Authorization: bearerToken,
          },
        }
      );

      return res.status(200).json(
        success({
          subscriber: subscriberDetails.data,
        })
      );
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new IndexController();
