const HttpMethod = require("@/constants/HttpMethod");
const Template = require("@/models/ScheduledCampaigns");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");

class CreateTemplateController extends WebController {
  constructor() {
    super("/:templateId", HttpMethod.GET, []);
  }

  async handler(req, res) {
    console.log("get template by id")
    try {
      const { templateId } = req.params;
      const templates = await Template.findById(templateId);

      return res.status(200).json(success({ templates }));
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new CreateTemplateController();
