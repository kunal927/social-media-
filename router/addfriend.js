const express = require("express");
const AddFriend = express.Router();
const UserProfile = require("../models/profiledata");

AddFriend.post("/addfriend", async (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/login");
  }
  const sessionUser = req.session.user;
  // console.log("Session User ID:", sessionUser._id);

  const friendId = req.body.friendId; // form se aaya
  let profile = await UserProfile.findOne({ userId: sessionUser._id });

  if (!profile) {
    // agar profile document nahi hai to create karo
    profile = new UserProfile({ userId: sessionUser._id, friends: [] });
  }
  if (sessionUser._id.toString() === friendId) {
    return res.redirect("/loginSuccessful");
  }

  // Add friend only if not already added
  const mongoose = require("mongoose");
  const friendObjectId = new mongoose.Types.ObjectId(friendId);
  if (
    !profile.friends.some((id) => id.toString() === friendObjectId.toString())
  ) {
    profile.friends.push(friendObjectId);
    await profile.save();
    console.log("Friend added successfully!");
  } else {
    console.log("Friend already added");
  }
  res.redirect("/loginSuccessful");
});

module.exports = AddFriend;
