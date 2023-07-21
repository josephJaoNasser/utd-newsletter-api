const HttpMethod = require("@/constants/HttpMethod");
const Template = require("@/models/ScheduledCampaigns");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");

class CreateTemplateController extends WebController {
  constructor() {
    super("/create", HttpMethod.POST, []);
  }

  async handler(req, res) {
    try {
      const newTemplate = new Template(req.body);
      const createdTemplate = await newTemplate.save();

      return res.status(200).json(success({ template: createdTemplate }));
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new CreateTemplateController();
