const express = require("express");
const RemoveFriend = express.Router();
const UserProfile = require("../models/profiledata");
const mongoose = require("mongoose");

RemoveFriend.post("/removefriend", async (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/login");
  }

  const sessionUser = req.session.user;
  const { friendId } = req.body; // hidden input se aaya friendId

  if (!friendId) {
    console.log("No friendId provided for removal");
    return res.redirect("/connections");
  }

  try {
    // friendId ko ObjectId me convert karke friends array se remove karo
    await UserProfile.updateOne(
      { userId: sessionUser._id },
      { $pull: { friends: new mongoose.Types.ObjectId(friendId) } }
    );

    console.log("Friend removed successfully!");
  } catch (err) {
    console.error("Error removing friend:", err);
  }

  // Connections page pe redirect karo taki list refresh ho
  res.redirect("/connections");
});

module.exports = RemoveFriend;
