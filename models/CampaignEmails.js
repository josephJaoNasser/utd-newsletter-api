const { Schema, model } = require("mongoose");

const CampaignEmailsSchema = new Schema({
  campaignId: {
    type: String,
    required: [true, "Please provide a mailchimp campaign ID"],
  },
  html: String,
  revolvappMarkup: String,
  postAssignments: {
    type: Array,
    default: () => [],
  },
  globalContentLimits: {
    type: {
      header: {
        mode: String,
        limit: Number,
      },
      postBody: {
        mode: String,
        limit: Number,
      },
    },
    default: {
      header: {
        mode: "word",
        limit: 50,
      },
      postBody: {
        mode: "word",
        limit: 50,
      },
    },
  },
});

const CampaignEmails = model("CampaignEmails", CampaignEmailsSchema);
module.exports = CampaignEmails;
