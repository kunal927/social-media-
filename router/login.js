const express = require("express");
const Signup = require("../models/Signup");
const bcrypt = require("bcryptjs");
const login = express.Router();

// GET login page
login.get("/", (req, res) => {
  res.render("login", { title: "Login", errors: [], oldInput: { Email: "" } });
  req.session.isAuth = false;
});

// POST login
login.post("/", async (req, res) => {
  const { Email, Password } = req.body;

  try {
    // 1️⃣ Find user by email
    const user = await Signup.findOne({ Email });
    if (!user) {
      return res.status(400).render("login", {
        title: "Login",
        errors: ["Invalid Email or Password"],
        oldInput: { Email },
      });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).render("login", {
        title: "Login",
        errors: ["Invalid Email or Password"],
        oldInput: { Email },
      });
    }

    // 3️⃣ Password correct → redirect to loginSuccessful route
    req.session.isAuth = true;
    req.session.user = user;
    await req.session.save();
    res.redirect("/loginSuccessful");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = login;
