const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
const mongoose = require('mongoose');

const mongoDB = async () => {
  try {
    const uri = isNode ? process.env.MONGODB_URI : null;
    if (!uri) {
        console.log("No MONGODB_URI found");
        return;
    }
    await mongoose.connect(uri, {
      dbName: 'gofood',
    });
    console.log("Connected to MongoDB");

    // Optional: Pre-fetch data for caching if needed
    const foodItemsCollection = mongoose.connection.db.collection("food_items");
    const foodCategoryCollection = mongoose.connection.db.collection("foodCategory");
    const adminCollection = mongoose.connection.db.collection("admins");

    global.food_items = await foodItemsCollection.find({}).toArray();
    global.foodCategory = await foodCategoryCollection.find({}).toArray();

    // Seed admin if not exists
    const adminCount = await adminCollection.countDocuments();
    if (isNode && adminCount === 0) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("123456", salt); // Initial password
      await adminCollection.insertOne({
        name: "Admin",
        email: "admin@chowzy.com",
        password: hashedPassword,
        date: new Date()
      });
      console.log("Default admin created");
    }

  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    throw error;
  }
};

module.exports = mongoDB;
