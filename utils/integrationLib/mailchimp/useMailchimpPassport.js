const IntegrationServices = require("@/constants/IntegrationServices");
const Integration = require("@/models/Integration");
const User = require("@/models/User");
const passport = require("passport");
const MailchimpStrategy = require("passport-mailchimp").Strategy;

function useMailchimpPassport() {
  const { MAILCHIMP_CLIENT_ID, MAILCHIMP_CLIENT_SECRET, SERVER_URL } =
    process.env;

  passport.use(
    new MailchimpStrategy(
      {
        passReqToCallback: true,
        clientID: MAILCHIMP_CLIENT_ID,
        clientSecret: MAILCHIMP_CLIENT_SECRET,
        callbackURL: `${SERVER_URL}/integrations/mailchimp/oauth/callback`,
      },
      async function (req, accessToken, refreshToken, profile, done) {
        try {
          const { state, code } = req.query;
          const stateJson = JSON.parse(state);
          const { uid: userId, utdId } = stateJson;
          const integrationData = {
            userId,
            utdId,
            service: IntegrationServices.mailchimp,
            payload: {
              accessToken,
              refreshToken,
              profile,
            },
          };

          // direct is used for logins only
          if (stateJson.direct) {
            const { id } = profile;
            const userIntegration = await Integration.findOne({
              "payload.profile.id": id,
            });

            if (!userIntegration)
              return done(null, false, { message: "Integration not found" });

            const user = await User.findById(userIntegration.userId);

            if (!user) return done(null, false, { message: "User not found" });

            stateJson.uid = user._id.toString();
            stateJson.utdId = user.userId;
            req.query.state = JSON.stringify(stateJson);

            return done(null, { integration: userIntegration, user });
          }

          // non direct
          const user = await User.findById(userId);
          const userIntegrations = await Integration.find({
            userId,
          });
          const duplicateIntegration = userIntegrations.find(
            (integration) => integration.payload.profile.id === profile.id
          );

          if (duplicateIntegration) {
            const updatedIntegration = await Integration.findByIdAndUpdate(
              duplicateIntegration._id,
              integrationData,
              { new: true }
            );
            return done(null, { integration: updatedIntegration, user });
          }

          const newIntegration = new Integration(integrationData);
          const createdIntegration = await newIntegration.save();

          return done(null, { integration: createdIntegration, user });
        } catch (e) {
          console.log(e);
          return done(null, false, { message: "Error while linking user" });
        }
      }
    )
  );
}

module.exports = useMailchimpPassport;
