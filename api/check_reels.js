const mongoose = require('mongoose');

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

const ReelSchema = new mongoose.Schema({
    videoUrl: String,
    title: String,
    description: String,
    date: Date
});

const Reel = mongoose.model('Reel', ReelSchema);

async function checkReels() {
    try {
        if (isNode) {
            try {
                require('dotenv').config();
            } catch (err) {
                // Silenced dotenv error
            }
        }
        const mongoUri = isNode ? process.env.MONGODB_URI : null;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined');
        }
        await mongoose.connect(mongoUri, { dbName: 'gofood' });
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
