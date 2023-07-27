const { default: axios } = require("axios");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");
const HttpMethod = require("@/constants/HttpMethod");
const User = require("@/models/User");
const jwt = require("jsonwebtoken");
const Integration = require("@/models/Integration");
const IntegrationServices = require("@/constants/IntegrationServices");

class AuthController extends WebController {
  constructor() {
    super("/auth", HttpMethod.POST);
  }

  async handler(req, res) {
    try {
      const { email, password, keepMeSignedIn } = req.body;
      const Auth = new AuthController();

      const utdUser = await Auth._login({
        email,
        password,
        keepMeSignedIn,
        isOAuth: false,
      });

      if (!utdUser?.success) {
        return res.status(400).json(failed(utdUser?.message));
      }

      const {
        id,
        firstName,
        lastName,
        avatar,
        contactNumber,
        roleId,
        timezone,
      } = utdUser.data;

      let user = await User.findOne({ userId: id.toString() });

      if (!user) {
        user = await User.create({
          userId: id.toString(),
          firstName,
          lastName,
          avatar,
          contactNumber,
          emailAddress: utdUser.data.email,
          roleId,
          timezone,
        });
      }

      const { JWT_SECRET_TOKEN } = process.env;

      const token = jwt.sign(
        { id: id.toString(), access_token: utdUser.token },
        JWT_SECRET_TOKEN
      );

      const mailchimpAccounts = await Integration.find({
        userId: user._id,
        service: IntegrationServices.mailchimp,
      });

      return res.status(200).json(
        success({
          user,
          mailchimpAccounts,
          token,
        })
      );
    } catch (err) {
      console.log(err);
      return res.status(getErrorCode(err)).send(failed(err));
    }
  }

  /**
   * @param {{email: string, password: string, keepMeSignedIn: boolean, isOauth: boolean}} credentials
   * @returns user data
   */
  async _login(credentials) {
    try {
      const res = await axios.post(
        "https://www.uptodateconnect.com/api/v1/user/login",
        credentials
      );
      return res.data;
    } catch (err) {
      console.log(err);
      throw new Error(err.response.data);
    }
  }
}

module.exports = new AuthController();
