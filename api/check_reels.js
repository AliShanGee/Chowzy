const mongoose = require('mongoose');
require('dotenv').config();

const ReelSchema = new mongoose.Schema({
    videoUrl: String,
    title: String,
    description: String,
    date: Date
});

const Reel = mongoose.model('Reel', ReelSchema);

async function checkReels() {
    const isNode = typeof process !== 'undefined' && process.versions && !!process.versions.node;
    if (!isNode) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'gofood' });
        console.log("Connected to MongoDB");
        const reels = await Reel.find({});
        console.log("Reels in database:", JSON.stringify(reels, null, 2));
        if (process.exit) process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        if (process.exit) process.exit(1);
    }
}

checkReels();
