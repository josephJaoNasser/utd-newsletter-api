const HttpMethod = require("@/constants/HttpMethod");
const Template = require("@/models/ScheduledCampaigns");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");

class UpdateTemplateController extends WebController {
  constructor() {
    super("/update/:templateId", HttpMethod.PATCH, []);
  }

  async handler(req, res) {
    try {
      const { templateId } = req.params;
      const updatedTemplate = await Template.findByIdAndUpdate(
        templateId,
        req.body
      );

      return res.status(200).json(success({ template: updatedTemplate }));
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new UpdateTemplateController();
