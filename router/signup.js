const express = require("express");
const { check, validationResult } = require("express-validator");
const Signup = require("../models/Signup"); // Mongoose model
const bcrypt = require("bcryptjs");

const signup = express.Router();

// GET signup page
signup.get("/", (req, res) => {
  res.render("signup", {
    title: "Signup Page using JWT",
    errors: [],
    oldInput: { FullName: "", Email: "", Password: "" },
  });
});

// POST signup with validation
signup.post(
  "/",
  [
    check("FullName")
      .notEmpty()
      .withMessage("Name is required")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Name must be at least 5 characters long")
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Name must contain only letters and spaces"),

    check("Email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address"),

    check("Password")
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number"),
  ],
  async (req, res) => {
    const { FullName, Email, Password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("signup", {
        title: "Signup Page using JWT",
        errors: errors.array().map((err) => err.msg),
        oldInput: { FullName, Email, Password },
      });
    }

    try {
      // ✅ Hash password
      const hashedPassword = await bcrypt.hash(Password, 12);

      // ✅ Save user with hashed password
      const newUser = new Signup({
        FullName,
        Email,
        Password: hashedPassword,
      });

      await newUser.save();
      console.log("✅ User saved successfully");
      req.session.isAuth = false;

      res.render("login", {
        title: "Login",
        errors: [],
        oldInput: { Email: "" },
      });
    } catch (err) {
      console.error("❌ Error saving user:", err);

      if (err.code === 11000) {
        return res.status(400).render("signup", {
          title: "Signup Page using JWT",
          errors: ["Email already exists"],
          oldInput: { FullName, Email, Password },
        });
      }

      res.status(500).send("Server error");
    }
  }
);

module.exports = signup;
