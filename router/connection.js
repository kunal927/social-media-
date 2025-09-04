const express = require("express");
const Userdata = require("../models/profiledata");
const Connection = express.Router();

Connection.get("/connections", async (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/login");
  }

  const sessionUser = req.session.user;

  // Fetch user profile and friends
  let profile = await Userdata.findOne({ userId: sessionUser._id }).populate(
    "friends",
    "FullName _id"
  );

  // If no friends, send empty array
  let friends = profile?.friends || [];

  // For each friend, get their profile image from Userdata
  friends = await Promise.all(
    friends.map(async (friend) => {
      const friendProfile = await Userdata.findOne({ userId: friend._id });
      return {
        _id: friend._id,
        FullName: friend.FullName,
        profileImage: friendProfile?.profileImage || null,
      };
    })
  );

  res.render("connections", { friends });
});

module.exports = Connection;
