const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = (isNode && process.env.JWT_SECRET) || 'dummy_secret_for_ci';

router.post(
  "/createuser",
  [
    body('name', 'Name must be at least 3 characters long.').isLength({ min: 3 }),
    body('email', 'Please enter a valid email.').isEmail(),
    body('phone', 'Phone number must be at least 10 characters long.').isLength({ min: 10 }),
    body('password', 'Password must be at least 5 characters long.').isLength({ min: 5 }),
    body('geolocation', 'Address is required.').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array().map(e => e.msg).join(', ') });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: hashedPassword,
        location: req.body.geolocation
      });

      res.status(201).json({ success: true, username: req.body.name });
    } catch (error) {
      console.error(error.message);
      if (error.code === 11000) {
        return res.status(400).json({ success: false, message: "An account with this email already exists." });
      }
      res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
  }
);

router.post(
  "/login",
  [
    body('email', 'Please enter a valid email.').isEmail(),
    body('password', 'Password cannot be blank.').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array().map(e => e.msg).join(', ') });
    }

    const { email, password } = req.body;

    try {
      const userData = await User.findOne({ email });
      if (!userData) {
        return res.status(400).json({ success: false, message: "Invalid credentials. Please try again." });
      }

      const isMatch = await bcrypt.compare(password, userData.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid credentials. Please try again." });
      }

      const payload = {
        user: {
          id: userData.id
        }
      };

      const authToken = jwt.sign(payload, jwtSecret);

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
