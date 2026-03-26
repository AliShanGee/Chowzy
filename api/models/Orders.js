const mongoose = require('mongoose')
const { Schema } = mongoose;
const OrderSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    order_data: {
        type: Array,
        required: true,
    },
    delivery_date: {
        type: Date,
        default: null
    },
    delivery_time: {
        type: String,
        default: null
    },
    delivery_status: {
        type: String,
        enum: ['pending', 'scheduled', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    notification_sent: {
        type: Boolean,
        default: false
    }
});
OrderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('Order', OrderSchema);