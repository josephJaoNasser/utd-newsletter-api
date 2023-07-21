const HttpMethod = require("@/constants/HttpMethod");
const Template = require("@/models/ScheduledCampaigns");
const { failed, getErrorCode, success } = require("@/utils/response");
const WebController = require("@/www/WebController");

class DeleteTemplateController extends WebController {
  constructor() {
    super("/delete/:templateId", HttpMethod.DELETE, []);
  }

  async handler(req, res) {
    try {
      const { templateId } = req.params;
      const deleteResult = await Template.findByIdAndDelete(templateId)

      return res.status(200).json(success({ template: deleteResult }));
    } catch (err) {
      console.error(err);
      return res.status(getErrorCode(err)).json(failed(err));
    }
  }
}

module.exports = new DeleteTemplateController();
