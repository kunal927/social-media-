const express = require("express");
const about = express.Router();

about.get("/about", (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/login");
  }
  const user = req.session.user;
  res.render("About", { title: "About", user });
});

module.exports = about;