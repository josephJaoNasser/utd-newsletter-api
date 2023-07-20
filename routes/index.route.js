const WebRouter = require("../www/WebRouter");

class IndexRoute extends WebRouter {
	constructor() {
		super("/", "/controllers/index");
	}
}

module.exports = new IndexRoute();