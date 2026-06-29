const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'fallback_secret'; // Use environment variable

router.post(
  "/admin/login",
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
      const adminData = await Admin.findOne({ email });
      if (!adminData) {
        return res.status(400).json({ success: false, message: "Invalid admin credentials." });
      }

      const isMatch = await bcrypt.compare(password, adminData.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid admin credentials." });
      }

      const payload = {
        admin: {
          id: adminData.id
        }
      };

      const authToken = jwt.sign(payload, jwtSecret);

      res.status(200).json({
        success: true,
        authToken: authToken,
        email: adminData.email
      });

    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
  }
);

module.exports = router;
