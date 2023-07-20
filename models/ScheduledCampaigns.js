const { Schema, model } = require("mongoose");

const ScheduledCampaignsSchema = new Schema({
  mailchimpCampaignId: {
    type: String,
    required: [
      true,
      "Please provide the mailchimp campaign ID of the campaign that you want to schedule",
    ],
  },
  scheduleTime: {
    type: Date,
    required: [true, "Please provide the schedule time"],
  },
});

const Template = model("Template", ScheduledCampaignsSchema);
module.exports = Template;
