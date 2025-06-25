const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const refreshTokens = []; // Use Redis/DB in production

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const newUser = new User({ username, email, password }); // password gets hashed via pre-save hook
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email, password);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: "7d" });

    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// REFRESH TOKEN
router.post("/token", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ error: "Refresh token invalid or expired." });
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const newAccessToken = jwt.sign({ id: payload.id }, ACCESS_SECRET, {
      expiresIn: "15m"
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: "Token refresh failed." });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  const { refreshToken } = req.body;
  const index = refreshTokens.indexOf(refreshToken);
  if (index !== -1) refreshTokens.splice(index, 1);
  res.json({ message: "Logged out successfully." });
});

module.exports = router;
