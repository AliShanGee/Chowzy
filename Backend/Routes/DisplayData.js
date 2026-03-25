const express = require('express')
const router = express.Router()
router.get('/foodData', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        // Ensure connection
        if (mongoose.connection.readyState !== 1) {
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

        const foodItemsData = await foodItemsCollection.find({}).toArray();
        const catData = await foodCategoryCollection.find({}).toArray();

        res.send([foodItemsData, catData]);
    } catch (error) {
        console.error(error.message);
        res.send("Server Error")
    }
})
module.exports = router;