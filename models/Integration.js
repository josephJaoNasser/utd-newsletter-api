const { Schema, model } = require("mongoose");

const IntegrationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, "Please provide a valid user ID"],
    ref: "User",
  },
  service: {
    type: String,
    required: [true, "Please specify the service provider of this integration"],
  },
  utdId: {
    type: String,
    required: [true, "Please provide the UP-TO-DATE user ID"],
  },
  payload: Object,
});

const Integration = model("Integration", IntegrationSchema);
module.exports = Integration;
