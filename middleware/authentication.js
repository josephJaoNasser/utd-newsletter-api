const User = require("../models/User");
const { failed } = require("../utils/response");
const jwt = require("jsonwebtoken");

const AuthenticationMiddleware = async (req, res, next) => {
  const { authorization: authorizationHeader } = req.headers;
  const { access_token: queryToken } = req.query;
  if (!authorizationHeader && !queryToken)
    return res
      .status(401)
      .json(failed("Please provide a valid authorization token."));

  let token = authorizationHeader
    ? authorizationHeader.split(" ")[1]
    : queryToken;

  if (!token)
    return res
      .status(401)
      .json(failed("Please provide a valid authorization token."));

  try {
    const { JWT_SECRET_TOKEN } = process.env;
    const data = jwt.verify(token, JWT_SECRET_TOKEN);

    const { id, access_token } = data;

    if (!id || !access_token)
      throw new Error("Wrong authorization token format.");

    const authenticatedUser = await User.findOne({ userId: id });

    res.locals.user = authenticatedUser;
    res.locals.access_token = access_token;

    next();
  } catch (err) {
    return res
      .status(401)
      .json(failed("You have provided an expired or invalid token."));
  }
};

module.exports = AuthenticationMiddleware;
