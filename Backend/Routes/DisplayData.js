const express = require('express')
const router = express.Router()
router.get('/foodData', async (req, res) => {
    try {
        const mongoose = require('mongoose');
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