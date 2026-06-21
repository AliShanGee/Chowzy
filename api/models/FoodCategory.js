const isNode = typeof process !== "undefined" && process.versions && process.versions.node; const mongoose = isNode ? require("mongoose") : {};

const FoodCategorySchema = new mongoose.Schema({
    CategoryName: {
        type: String,
        required: true
    }
}, { collection: 'foodCategory' });

FoodCategorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('foodCategory', FoodCategorySchema);
