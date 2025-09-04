const express = require("express");
const dashboard = express.Router();
const Signup = require("../models/Signup");

dashboard.get("/dashboard", async (req, res) => {
  // User not logged in → redirect to login page
  if (!req.session.isAuth) {
    return res.redirect("/login");
  }

  // User logged in → show dashboard
       const users = await Signup.find({}, 'FullName ,Email');
  res.render("dashboard", { title: "Dashboard", users });
});

module.exports = dashboard;
