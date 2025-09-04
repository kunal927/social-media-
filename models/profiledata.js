const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Signup" }, // link
  headline: String,
  education: String,
  location: String,
  city: String,
  dob: Date,
  contact: String,
  profileImage: String, // URL or path to profile photo
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Signup" }],
});

module.exports = mongoose.model("ProfileData", profileSchema);
