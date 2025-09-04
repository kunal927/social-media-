const mongoose = require("mongoose");
const Postschema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Signup" },
  content: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Signup" }],
});

module.exports = mongoose.model("Post", Postschema);
