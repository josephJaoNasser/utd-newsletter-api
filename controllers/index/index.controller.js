const HttpMethod = require("@/constants/HttpMethod");
const { failed, getErrorCode, success } = require("@/utils/response");
const  WebController = require("@/www/WebController");

class IndexController extends WebController {
	constructor() {
		super(
			"/",
			HttpMethod.GET,
			[]
		);
	}

	async handler(req, res) {
		try {
			return res.status(200).json(success({  }))
		} catch(err) {
			console.error(err);
			return res.status(getErrorCode(err)).json(failed(err));
		}
	}
}

module.exports = new IndexController();