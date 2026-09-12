const mongoose = require('mongoose')
const { Schema } = mongoose;

const DeliveredOrderSchema = new Schema({
    email: {
        type: String,
        required: true,
        index: true // Index email for fast filtering in /myOrderData queries
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
        default: Date.now,
        index: true // Index delivered_at for fast sorted retrieval without in-memory sorting
    }
});

module.exports = mongoose.model('DeliveredOrder', DeliveredOrderSchema);
