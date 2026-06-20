const mongoose = require('mongoose');

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

if (isNode) {
    require('dotenv').config();
}

async function checkReels() {
    try {
        const mongoURL = isNode ? process.env.MONGODB_URI : null;
        if (!mongoURL) {
            console.log("No MONGODB_URI found");
            return;
        }
        await mongoose.connect(mongoURL, { dbName: 'gofood' });
        console.log("Connected to MongoDB for reels check");

        const Reel = require('./models/Reel');
        const count = await Reel.countDocuments();
        console.log(`Current Reels in database: ${count}`);

        const reels = await Reel.find({});
        reels.forEach(r => {
            console.log(`- ${r.title}: ${r.videoUrl}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error("Reels check failed:", err);
    }
}

if (isNode && require.main === module) {
    checkReels();
}
