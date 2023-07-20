class WebController {
  constructor(pathName, httpMethod = "get", middlewares = []) {
    this._pathName = pathName;
    this._httpMethod = httpMethod;
    this._middlewares = middlewares;
  }

  async handler(req, res) {}

  getPathName() {
    return this._pathName;
  }
  getHttpMethod() {
    return this._httpMethod;
  }
  getMiddlewares() {
    return this._middlewares;
  }
}

module.exports = WebController;
