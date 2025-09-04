const express = require("express");
const UserProfile = require("../models/profiledata");
const Post = require("../models/post");

const loginSuccessful = express.Router();

loginSuccessful.get("/loginSuccessful", async (req, res) => {
  // Session check
  if (!req.session.user) return res.redirect("/login");
  const sessionUser = req.session.user;

  // DB se profile fetch

  let SuccessProfile = await UserProfile.findOne({ userId: sessionUser._id });
  const profileImg =
    SuccessProfile && SuccessProfile.profileImage
      ? SuccessProfile.profileImage
      : null;
  const safeProfile = SuccessProfile || {
    //Agar SuccessProfile mila hai DB se → safeProfile = SuccessProfile
    headline: "",
    education: "",
    location: "",
    city: "",
    dob: "",
    contact: "",
    profileImage: null,
  };

  // Fetch all posts and populate user info
  const allPosts = await Post.find({})
    .sort({ createdAt: -1 })
    .populate("userId");
  const postsWithUser = await Promise.all(
    allPosts.map(async (post) => {
      const userProfile = await UserProfile.findOne({
        userId: post.userId._id,
      });
      return {
        _id: post._id,
        FullName: post.userId.FullName,
        profileImg: userProfile?.profileImage || null,
        content: post.content,
      };
    })
  );

  // Fetch all users who have ever signed up (for contacts sidebar)
  const allUsers = await require("../models/Signup").find({});
  const contacts = await Promise.all(
    allUsers.map(async (user) => {
      const userProfile = await UserProfile.findOne({ userId: user._id });
      return {
        FullName: user.FullName,
        profileImg: userProfile?.profileImage || null,
        _id: user._id,
      };
    })
  );

  // Render EJS
  res.render("LoginSuccessful", {
    FullName: sessionUser.FullName || "User",
    profileImg,
    profile: safeProfile,
    posts: postsWithUser,
    contacts,
  });
});

module.exports = loginSuccessful;
