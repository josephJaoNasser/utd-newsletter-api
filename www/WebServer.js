const express = require("express");
const fs = require("fs");
const path = require("path");

// Default Middleware Imports //
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const useMailchimpPassport = require("@/utils/integrationLib/mailchimp/useMailchimpPassport");
const expressSession = require("express-session");

class WebServer {
  DEFAULT_PORT = 3333;

  constructor() {
    this._app = express();
    this._loadDefaultMiddlewares();
    this._dynamicallyLoadRoutes();
  }

  _loadDefaultMiddlewares() {
    const corsOptions = {
      origin: true,
    };

    this._app.use(bodyParser.json());
    this._app.use(bodyParser.urlencoded({ extended: false }));
    this._app.use(cors(corsOptions));

    this._app.use(
      expressSession({
        secret: process.env.APP_SECRET,
        resave: false,
        saveUninitialized: false,
      })
    );

    this._app.use(passport.initialize());
    this._app.use(passport.session());

    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (user, done) {
      done(null, user);
    });

    useMailchimpPassport();
  }

  _dynamicallyLoadRoutes() {
    const routeFolderContents = fs.readdirSync(
      path.join(__dirname, "../routes"),
      { withFileTypes: true }
    );
    const validRoutes = routeFolderContents
      .filter((dirent) => dirent.isFile())
      .map((file) => file.name)
      .filter((file) => file.endsWith(".route.js"));

    for (let routeFileName of validRoutes) {
      const pathName = path.join(__dirname, `../routes/${routeFileName}`);
      const RouteClass = require(pathName);
      this._app.use(RouteClass.getRoute());
    }
  }

  start() {
    const PORT = process.env.PORT || this.DEFAULT_PORT;
    this._app.listen(PORT, () =>
      console.info(`Server running at http://localhost:${PORT}`)
    );
  }
}

module.exports = new WebServer();
