const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  userId: {
    type: Number,
    required: [true, "UP-TO-DATE User ID is required"],
  },
  firstName: {
    type: String,
    required: [true, "Please provide a first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide a last name"],
  },
  avatar: {
    type: String,
    // required: [true, "Please provide an avatar"]
  },
  contactNumber: {
    type: String,
    default: null,
  },
  emailAddress: {
    type: String,
    required: [true, "Please provide an email address"],
  },
  roleId: {
    type: Number,
    required: [true, "Please provide a role ID"],
  },
  timezone: {
    type: String,
    required: [true, "Please provide a timezone"],
  },
});

const User = model("User", UserSchema);
module.exports = User;
