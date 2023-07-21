const { Schema, model } = require("mongoose");

const ScheduledCampaignsSchema = new Schema({
  campaign_id: {
    type: String,
    required: [
      true,
      "Please provide the mailchimp campaign ID of the campaign that you want to schedule",
    ],
  },
  schedule_time: {
    type: Date,
    required: [true, "Please provide the schedule time"],
  },
  batch_delivery: {
    type: {
      batch_delay: {
        type: Number,
        required: [
          true,
          "Please provide time between batches when specifying a batch delivery",
        ],
      },
      batch_count: {
        type: Number,
        required: [
          true,
          "Please specify the number of batches for the campaign send",
        ],
      },
    },
  },
  timewarp: Boolean,
});

const ScheduledCampaigns = model("Template", ScheduledCampaignsSchema);
module.exports = ScheduledCampaigns;
