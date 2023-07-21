const WebRouter = require("../www/WebRouter");

class TemplatesRoute extends WebRouter {
	constructor() {
		super("/", "/controllers/templates");
	}
}

module.exports = new TemplatesRoute();