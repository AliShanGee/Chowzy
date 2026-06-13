const mongoose = require('mongoose')
const { Schema } = mongoose;

const DeliveredOrderSchema = new Schema({
    email: {
        type: String,
        required: true,
        index: true // BOLT: Index for faster user order history retrieval
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

module.exports = mongoose.model('DeliveredOrder', DeliveredOrderSchema);
