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
    if (!isNode) return;
    try {
        const mongoURI = (isNode && process.env.MONGODB_URI) || "";
        if (!mongoURI) {
            console.error("MONGODB_URI not defined");
            return;
        }
        await mongoose.connect(mongoURI, { dbName: 'gofood' });
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

if (isNode && require.main === module) {
    checkReels();
}
