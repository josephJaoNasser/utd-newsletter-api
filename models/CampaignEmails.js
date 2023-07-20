const { Schema, model } = require("mongoose");

const CampaignEmailsSchema = new Schema({
  mailchimpCampaignId: {
    type: String,
    required: [true, "Please provide a mailchimp campaign ID"],
  },
  html: String,
  revolvappMarkup: String,
});

const CampaignEmails = model("CampaignEmails", CampaignEmailsSchema);
module.exports = CampaignEmails;
