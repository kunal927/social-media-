const express = require("express");
const UserProfile = require("../models/profiledata");
const Post = require("../models/post");

const postshow = express.Router();

// GET /postshow
postshow.get("/postshow", async (req, res) => {
  // Session check
  if (!req.session.user) return res.redirect("/login");

  const user = req.session.user;

  // Fetch user profile
  const profile = await UserProfile.findOne({ userId: user._id });

  // Fetch all posts and populate user info
  const allPosts = await Post.find({})
    .sort({ createdAt: -1 })
    .populate("userId");

  // For each post, fetch profile image
  const postsWithUser = await Promise.all(
    allPosts.map(async (post) => {
      const userProfile = await UserProfile.findOne({
        userId: post.userId._id,
      });
      return {
        FullName: post.userId.FullName,
        profileImg: userProfile?.profileImage || null,
        content: post.content,
      };
    })
  );

  // Render template with all posts and user info
  res.render("postshow", {
    title: "Create Post",
    user,
    profile: profile || {},
    posts: postsWithUser,
  });
});

// POST /postshow
postshow.post("/postshow", async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.redirect("/login");

    // Create new post
    const { content } = req.body;
    const newPost = new Post({
      userId: user._id,
      content,
    });
    await newPost.save();

    res.send("Post created successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong!");
  }
});

module.exports = postshow;
