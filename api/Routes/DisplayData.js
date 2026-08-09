const express = require('express')
const router = express.Router()
router.get('/foodData', async (req, res) => {
    try {
        if (global.food_items && global.foodCategory) {
            return res.send([global.food_items, global.foodCategory]);
        }
        
        const mongoose = require('mongoose');
        // Ensure connection if not available
        if (mongoose.connection.readyState !== 1) {
            if (!process.env.MONGODB_URI) {
                return res.status(500).send("Database connection URI not found");
            }
            await mongoose.connect(process.env.MONGODB_URI, {
                dbName: 'gofood',
                maxPoolSize: 10,
                minPoolSize: 2,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
        }
        const foodItemsCollection = mongoose.connection.db.collection("food_items");
        const foodCategoryCollection = mongoose.connection.db.collection("foodCategory");

        // Fetch food items and categories concurrently using Promise.all to reduce latency
        const [foodItemsData, catData] = await Promise.all([
            foodItemsCollection.find({}).toArray(),
            foodCategoryCollection.find({}).toArray()
        ]);

        // Update global cache
        global.food_items = foodItemsData;
        global.foodCategory = catData;

        res.send([foodItemsData, catData]);
    } catch (error) {
        console.error(error.message);
        res.send("Server Error")
    }
})
module.exports = router;