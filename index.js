const dotenv = require("dotenv");
const moduleAlias = require("module-alias");
dotenv.config();
moduleAlias.addAlias("@", __dirname);

const WebServer = require("./www/WebServer");
const MongoDatabase = require("./database/mongodb");

(async () => {
  console.log("Connecting to MongoDB...");
  try {
    const dbConnection = await MongoDatabase.connect();
    if (!dbConnection)
      return console.error("Server terminated. Unable to connect to MongoDB");
  } catch (err) {
    return console.error("Server terminated. Unable to connect to MongoDB");
  }

  console.log("Starting the server...");
  WebServer.start();
})();
