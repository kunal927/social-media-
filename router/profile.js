const express = require("express");
const Profile = express.Router();

const UserProfile = require("../models/profiledata");
Profile.get("/profile", async (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/login");
  }
  const user = req.session.user;
  const profile = await UserProfile.findOne({ userId: user._id });
  res.render("profile", { title: "Profile", user, profile: profile || {} });
});


module.exports = Profile;
