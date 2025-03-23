// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
require("dotenv").config();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/signup",
  [
    // Validate and sanitize inputs using express-validator
    body("name", "Name is required").notEmpty().trim().escape(),
    body("email", "Please include a valid email").isEmail().normalizeEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Secure Password Storage: Hash the password with bcrypt (includes salt generation)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      user = new User({ name, email, password: hashedPassword });
      await user.save();

      res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get JWT token
 * @access  Public
 */
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail().normalizeEmail(),
    body("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // JWT Best Practices: Create a payload and sign the token with expiration
      const payload = { userId: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ token, msg: "Login successful" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
