const WebRouter = require("../www/WebRouter");

class MailchimpIntegrationRoute extends WebRouter {
	constructor() {
		super("/integrations/mailchimp", "/controllers/integrations/mailchimp");
	}
}

module.exports = new MailchimpIntegrationRoute();