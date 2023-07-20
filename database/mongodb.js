const mongoose = require("mongoose");

class MongoDatabase {
	connect(connectionUrl) {
		if (!connectionUrl && !process.env.MONGODB_URL)
			throw new Error("MongoDB Error: Invalid connection url.")
		mongoose.connect(connectionUrl || process.env.MONGODB_URL);
		
		const db = mongoose.connection;
		
		return new Promise((resolve, reject) => {

			db.on("error", err => {
				console.error(`MongoDB Connection Error: ${err}`);	
				reject(err);
			});
			
			db.once("open", () => {
				console.info("Successfully connected to MongoDB!");
				resolve(db);	
			});
			
		});
	}	
}

module.exports = new MongoDatabase();