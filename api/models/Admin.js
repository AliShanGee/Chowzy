const isNode = typeof process !== "undefined" && process.versions && process.versions.node; const mongoose = isNode ? require("mongoose") : {};
const { Schema } = mongoose;

const AdminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Admin', AdminSchema);
