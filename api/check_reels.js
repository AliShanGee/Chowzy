const mongoose = require('mongoose');
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
if (isNode) {
    require('dotenv').config();
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
        const mongoURI = isNode ? process.env.MONGODB_URI : null;
        if (!mongoURI) {
            console.error("MONGODB_URI not found");
            if (isNode) process.exit(1);
            return;
        }
        await mongoose.connect(mongoURI, { dbName: 'gofood' });
        console.log("Connected to MongoDB");
        const reels = await Reel.find({});
        console.log("Reels in database:", JSON.stringify(reels, null, 2));
        if (isNode) process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        if (isNode) process.exit(1);
    }
}

if (isNode) {
    checkReels();
}
