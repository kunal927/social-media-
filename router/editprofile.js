const express = require("express");
const Signup = require("../models/Signup");
const UserProfile = require("../models/profiledata");
const editprofile = express.Router();

// GET edit profile page
editprofile.get("/editprofile", async (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/login");
  }

  const sessionUser = req.session.user;
  const profile = await UserProfile.findOne({ userId: sessionUser._id });

  res.render("editprofile", {
    title: "Edit Profile",
    oldInput: profile || {
      headline: "",
      education: "",
      location: "",
      city: "",
      dob: "",
      contact: "",
      profileImage: "",
    },
  });
});

// POST edit profile
editprofile.post("/editprofile", async (req, res) => {
  try {
    const { headline,education, location, city, dob, contact } = req.body;
    const sessionUser = req.session.user;

    if(!req.file){
      return res.status(400).send('Profile image is required')
      }
      
    const profileImage = req.file.filename;

    let profile = await UserProfile.findOne({ userId: sessionUser._id });
    if (!profile) profile = new UserProfile({ userId: sessionUser._id });

    profile.headline = headline;
    profile.education = education;
    profile.location = location;
    profile.city = city;
    profile.dob = dob  ,
    profile.contact = contact;
    profile.profileImage = profileImage;

    await profile.save();

    req.session.userProfile = profile;
    await req.session.save();


    // ✅ Redirect to /profile route instead of direct render
    res.redirect("/profile");
  } catch (err) {
    console.error("Edit profile error:", err);
    res.status(500).render("editprofile", {
      title: "Edit Profile",
      oldInput: req.body,
      errors: ["Server error. Please try again."],
    });
  }
});

module.exports = editprofile;
