const mongoose = require("mongoose");
require("dotenv").config();

// It's a good practice to hide your credentials, you can use environment variables for this.
const mongoURL = process.env.MONGODB_URI ;

const mongoDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(mongoURL, {
      dbName: 'gofood',
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB successfully");

    // Fetch food items
    const foodItemsCollection = mongoose.connection.db.collection("food_items");
    const foodItemsData = await foodItemsCollection.find({}).toArray();

    // Fetch food categories
    const foodCategoryCollection =
      mongoose.connection.db.collection("foodCategory");
    const catData = await foodCategoryCollection.find({}).toArray();

    if (foodItemsData.length === 0) {
      console.warn("Warning: 'food_items' collection is empty. Check database content.");
    } else {
      console.log(`Fetched ${foodItemsData.length} food items and ${catData.length} categories`);
    }

    // Make data available globally
    global.food_items = foodItemsData;
    global.foodCategory = catData;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.error(
        "Connection refused - check your MongoDB Atlas connection string and network access",
      );
    } else if (error.name === "MongooseServerSelectionError") {
      console.error(
        "Server selection failed - check if your IP is whitelisted in MongoDB Atlas",
      );
    }
    console.error("Full error details:", error);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = mongoDB;
