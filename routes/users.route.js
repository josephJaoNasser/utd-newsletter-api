const WebRouter = require("../www/WebRouter");

class UsersRoute extends WebRouter {
  constructor() {
    super("/users", "/controllers/users");
  }
}

module.exports = new UsersRoute();