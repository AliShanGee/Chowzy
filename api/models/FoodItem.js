const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
    CategoryName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    options: {
        type: [Object],
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { collection: 'food_items' });

FoodItemSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('food_items', FoodItemSchema);
