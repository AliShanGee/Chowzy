const mongoose = require('mongoose');

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
if (isNode) {
    try {
        require('dotenv').config();
    } catch (err) {
        // Silence error
    }
}

const ReelSchema = new mongoose.Schema({
    videoUrl: String,
    title: String,
    description: String,
    date: Date
});

const Reel = mongoose.model('Reel', ReelSchema);

async function checkReels() {
    try {
        const mongoUri = (isNode && process.env.MONGODB_URI) || null;
        if (!mongoUri) {
            console.log("MONGODB_URI not found, skipping checkReels");
            return;
        }
        await mongoose.connect(mongoUri, { dbName: 'gofood' });
        console.log("Connected to MongoDB");
        const reels = await Reel.find({});
        console.log("Reels in database:", JSON.stringify(reels, null, 2));
        if (isNode && process.exit) process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        if (isNode && process.exit) process.exit(1);
    }
}

if (isNode && require.main === module) {
    checkReels();
}
