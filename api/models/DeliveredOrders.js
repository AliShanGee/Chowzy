const mongoose = require('mongoose')
const { Schema } = mongoose;

const DeliveredOrderSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    order_data: {
        type: Array,
        required: true,
    },
    delivery_date: {
        type: Date,
        required: true
    },
    delivery_time: {
        type: String,
        required: true
    },
    payment_info: {
        method: String,
        transactionId: String
    },
    delivered_at: {
        type: Date,
        default: Date.now
    }
});

// Compound index on { email: 1, delivered_at: -1 } to optimize user history lookups and sorting
DeliveredOrderSchema.index({ email: 1, delivered_at: -1 });

module.exports = mongoose.model('DeliveredOrder', DeliveredOrderSchema);
