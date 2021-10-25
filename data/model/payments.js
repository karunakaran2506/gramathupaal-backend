const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({

    orderid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: true
    },
    totalamount: {
        type: Number,
        required: true
    },
    razorpay_payment_id: {
        type: String,
        default: null
    },
    razorpay_order_id: {
        type: String,
        default: null
    },
    razorpay_signature: {
        type: String,
        default: null
    },
    isactive: {
        type: Boolean,
        default: false
    },
    createdat: {
        type: Date,
        default: new Date()
    }
},
    {
        timezone: 'Asia/Kolkata'
    }
)

module.exports = Payment = mongoose.model('payment', PaymentSchema);