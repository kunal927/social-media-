const express = require("express");
const LikeRouter = express.Router();
const Post = require("../models/post");

// Toggle Like / Unlike
LikeRouter.post("/like/:postId", async (req, res) => {
  if (!req.session.isAuth) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  try {
    const userId = req.session.user._id;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (!post.likes) post.likes = [];

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    // JSON response (better for frontend AJAX)
    res.json({
      success: true,
      likesCount: post.likes.length,
      liked: !alreadyLiked,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = LikeRouter;
