const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

router.post(
  "/createuser", // Corrected the route from "/creatuser" to "/createuser"
  [
    // --- Validation Rules ---
    body('name', 'Name must be at least 3 characters long.').isLength({ min: 3 }),
    body('email', 'Please enter a valid email.').isEmail(),
    body('phone', 'Phone number must be at least 10 characters long.').isLength({ min: 10 }),
    body('password', 'Password must be at least 5 characters long.').isLength({ min: 5 }),
    body('geolocation', 'Address is required.').notEmpty()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors, send a 400 response with the error messages
      return res.status(400).json({ success: false, message: errors.array().map(e => e.msg).join(', ') });
    }

    try {
      // --- Secure Password Hashing ---
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Create the user with the hashed password
      await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: hashedPassword, // Store the hashed password
        location: req.body.geolocation // Ensure field name matches schema
      });

      res.status(201).json({ success: true, username: req.body.name });
    } catch (error) {
      console.error(error.message);
      // Handle potential duplicate email error
      if (error.code === 11000) {
        return res.status(400).json({ success: false, message: "An account with this email already exists." });
      }
      res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
  }
);

router.post(
  "/loginuser",
  [
    // --- Validation Rules ---
    body('email', 'Please enter a valid email.').isEmail(),
    body('password', 'Password cannot be blank.').exists(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array().map(e => e.msg).join(', ') });
    }

    const { email, password } = req.body;

    try {
      // Find user by email
      const userData = await User.findOne({ email });
      if (!userData) {
        return res.status(400).json({ success: false, message: "Invalid credentials. Please try again." });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, userData.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid credentials. Please try again." });
      }

      // --- Create JWT Payload ---
      const payload = {
        user: {
          id: userData.id
        }
      };

      // --- Sign the token ---
      const authToken = jwt.sign(payload, jwtSecret);

      // Send back the auth token and user details
      res.status(200).json({
        success: true,
        authToken: authToken,
        user: { name: userData.name, email: userData.email, phone:userData.phone, location: userData.location }
      });

    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
  }
);

module.exports = router;