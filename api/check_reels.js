const mongoose = require('mongoose');
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

if (isNode) {
    try {
        require('dotenv').config();
    } catch (e) {}
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
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'gofood' });
        console.log("Connected to MongoDB");
        const reels = await Reel.find({});
        console.log("Reels in database:", JSON.stringify(reels, null, 2));
        if (isNode && typeof process !== 'undefined' && process.exit) {
            process.exit(0);
        }
    } catch (error) {
        console.error("Error:", error);
        if (isNode && typeof process !== 'undefined' && process.exit) {
            process.exit(1);
        }
    }
}

checkReels();
