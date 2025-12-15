const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
console.log(process.env.ADMIN_EMAIL);

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Email check
    if (email != process.env.ADMIN_EMAIL) {
      return res.status(401).json({ message: "Invalid email" });
    }

    // Password check
    const isMatch = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
   
    // JWT
    const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("admintoken", token, {
      httpOnly: true,
      sameSite: "none", // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: true,
      path:"/"
    });
    res.status(200).json({
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
