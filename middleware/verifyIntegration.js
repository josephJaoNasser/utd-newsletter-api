const Integration = require("@/models/Integration");
const IntegrationServices = require("@/constants/IntegrationServices");
const { failed } = require("@/utils/response");

const verifyIntegration = (service) => (req, res, next) => {
  const { user } = res.locals;

  Integration.findOne({
    userId: user._id,
    service,
  })
    .then((integration) => {
      if (!integration) {
        return res
          .status(403)
          .send(
            failed(
              `You have no access to ${service} services. Please provide the appropriate credentials`
            )
          );
      }

      res.locals.integration = integration;

      next();
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).send(failed("Failed to verify integration"));
    });
};

module.exports = {
  mailchimp: verifyIntegration(IntegrationServices.mailchimp),
};
