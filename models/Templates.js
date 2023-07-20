const { Schema, model } = require("mongoose");

const TemplateSchema = new Schema({
  title: {
    type: String,
    default: "Untitled Template",
  },
  revolvappMarkup: {
    type: String,
    required: [true, "Cannot save blank template"],
  },
});

const Template = model("Template", TemplateSchema);
module.exports = Template;
