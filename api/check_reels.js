const mongoose = require('mongoose');
require('dotenv').config();

const ReelSchema = new mongoose.Schema({
    videoUrl: String,
    title: String,
    description: String,
    date: Date
});

const Reel = mongoose.model('Reel', ReelSchema);

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

async function checkReels() {
    try {
        await mongoose.connect(isNode && process.env.MONGODB_URI, { dbName: 'gofood' });
        console.log("Connected to MongoDB");
        const reels = await Reel.find({});
        console.log("Reels in database:", JSON.stringify(reels, null, 2));
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkReels();
