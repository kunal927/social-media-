const express=require("express");
const createpost=express.Router();
const Post=require("../models/post");
const UserProfile = require("../models/profiledata");
const postshow = require("./Postshow");

createpost.get("/createpost",async(req,res)=>{
   const user = req.session.user;
   console.log(user.FullName);
    const profile = await UserProfile.findOne({ userId: user._id });
    if(!req.session.isAuth){
        return res.redirect("/login");
    }
    res.render("createpost",{title:"Create Post",profile:profile,user:user});
});

createpost.post("/createpost", async (req, res) => {
  try {
    if (!req.session.isAuth) {
      return res.redirect("/login");
    }

    const user = req.session.user; // logged-in user
    const { content } = req.body;

    const newPost = new Post({
      userId: user._id,   // konsa user post kar raha hai
      content
    });

    await newPost.save();
    res.redirect("/loginSuccessful");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
module.exports=createpost;
