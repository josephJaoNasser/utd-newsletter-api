const WebRouter = require("../www/WebRouter");

class SubscribersRoute extends WebRouter {
  constructor() {
    super("/subscribers", "/controllers/subscribers");
  }
}

module.exports = new SubscribersRoute();
