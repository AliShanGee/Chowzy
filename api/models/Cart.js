const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    items: [
        {
            id: { type: String, required: true },
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            size: { type: String, required: true },
            price: { type: Number, required: true },
            img: { type: String, required: true }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('cart', CartSchema);
