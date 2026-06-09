const mongoose = require('mongoose');
require('dotenv').config();

const Reel = require('./models/Reel');

async function checkReels() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const reels = await Reel.find({});
        console.log("Reels in database:", JSON.stringify(reels, null, 2));
        if (typeof process !== 'undefined' && process.exit) {
            process.exit(0);
        }
    } catch (error) {
        console.error("Error:", error);
        if (typeof process !== 'undefined' && process.exit) {
            process.exit(1);
        }
    }
}

if (require.main === module) {
    checkReels();
}
