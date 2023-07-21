const WebRouter = require("../www/WebRouter");

class CampaignsRoute extends WebRouter {
  constructor() {
    super("/campaigns", "/controllers/campaigns");
  }
}

module.exports = new CampaignsRoute();
