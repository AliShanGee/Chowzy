const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
const mongoose = isNode ? require('mongoose') : null;

if (isNode) {
    require('dotenv').config();
}

const ReelSchema = isNode ? new mongoose.Schema({
    videoUrl: String,
    title: String,
    description: String,
    date: Date
}) : null;

const Reel = isNode ? mongoose.model('Reel', ReelSchema) : null;

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

if (isNode && require.main === module) {
    checkReels();
}
