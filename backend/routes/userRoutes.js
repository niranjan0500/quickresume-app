const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// 1️⃣ Register User (with encrypted password)
router.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User Registered Successfully" });

  } catch (err) {

    console.log(err);
    res.status(500).json({ error: "Registration Failed" });

  }

});


// 2️⃣ Login User
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // generate JWT token
    const token = jwt.sign(
      { id: user._id },
      "mysecretkey",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {

    console.log(err);
    res.status(500).json({ error: "Login failed" });

  }

});


// 3️⃣ Get All Users
router.get("/", async (req, res) => {

  try {

    const users = await User.find();

    res.json(users);

  } catch (err) {

    console.log(err);
    res.status(500).json({ error: "Failed to fetch users" });

  }

});


module.exports = router;