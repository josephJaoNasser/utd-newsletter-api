const HttpMethod = require("@/constants/HttpMethod");
const Template = require("@/models/ScheduledCampaigns");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");

class CreateTemplateController extends WebController {
  constructor() {
    super("/", HttpMethod.GET, []);
  }

  async handler(req, res) {
    try {
      const templates = await Template.find();

      return res.status(200).json(success({ templates }));
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new CreateTemplateController();
