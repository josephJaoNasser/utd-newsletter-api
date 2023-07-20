const { failed } = require("@/utils/response");
const WebController = require("@/www/WebController");

class UserIndexController extends WebController {
  constructor() {
    super("/");
  }

  async handler(req, res) {
    res.status(404).send(failed("Nothing to access here"));
  }
}

module.exports = new UserIndexController();
