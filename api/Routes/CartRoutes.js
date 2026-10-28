const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Route to update/save user's cart
router.post('/updatecart', async (req, res) => {
    const { email, cartData } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        // Bolt Optimization: Atomic update with upsert: true reduces DB roundtrips from 2 to 1 and prevents race conditions
        await Cart.findOneAndUpdate(
            { email },
            { items: cartData, date: Date.now() },
            { upsert: true, new: true }
        ).lean();
        res.status(200).json({ success: true, message: "Cart updated successfully" });
    } catch (error) {
        console.error("Error updating cart:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Route to fetch user's cart
router.post('/getcart', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        // Bolt Optimization: .lean() bypasses Mongoose document hydration for faster plain JS object retrieval
        const cart = await Cart.findOne({ email }).lean();
        if (!cart) {
            return res.status(200).json({ success: true, cartData: [] });
        }
        res.status(200).json({ success: true, cartData: cart.items });
    } catch (error) {
        console.error("Error fetching cart:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Admin route to get all user carts
router.get('/admin/allcarts', async (req, res) => {
    try {
        // Bolt Optimization: .lean() bypasses Mongoose document hydration for list queries
        const carts = await Cart.find({}).lean();
        res.status(200).json({ success: true, carts });
    } catch (error) {
        console.error("Error fetching all carts:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
