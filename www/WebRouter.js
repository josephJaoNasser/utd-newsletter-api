const { Router } = require("express");
const fs = require("fs");
const path = require("path");

class WebRouter {
  constructor(pathName, controllersPathName) {
    this._route = new Router();
    this._pathName = pathName;
    this._controllersPathName = controllersPathName;
    this._dynamicallyLoadControllers();
  }

  _dynamicallyLoadControllers = () => {
    const controllerFolderContents = fs.readdirSync(
      path.join(__dirname, `../${this._controllersPathName}`),
      { withFileTypes: true }
    );
    const validControllers = controllerFolderContents
      .filter((dirent) => dirent.isFile())
      .map((file) => file.name)
      .filter((file) => file.endsWith(".controller.js"));

    for (let controllerFileName of validControllers) {
      const ControllerClass = require(path.join(
        __dirname,
        `../${this._controllersPathName}/${controllerFileName}`
      ));
      this.addController(ControllerClass);
    }
  };

  addController(controller) {
    // console.info(`Adding controller :: [${controller.getHttpMethod()}] :: ${this.getPathName() + controller.getPathName()}`)
    this._route[controller.getHttpMethod()](
      this.getPathName() + controller.getPathName(),
      controller.getMiddlewares(),
      [controller.handler]
    );
  }

  getPathName() {
    return this._pathName;
  }
  getRoute() {
    return this._route;
  }
}

module.exports = WebRouter;
