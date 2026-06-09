const express = require('express');
const router = express.Router();

router.get('/foodData', async (req, res) => {
    try {
        const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
        let foodData = [];
        let categoryData = [];

        if (isNode) {
            const mongoose = require('mongoose');
            if (mongoose.connection.readyState === 1) {
                foodData = await mongoose.connection.db.collection("food_items").find({}).toArray();
                categoryData = await mongoose.connection.db.collection("foodCategory").find({}).toArray();
            }
        }

        // Return whatever we have (might be empty in serverless if not connected properly)
        res.send([foodData, categoryData]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
