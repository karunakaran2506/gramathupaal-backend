const mongoose = require('mongoose');
const { Paymentmethod1 } = require('../common/constants');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    orderid: {
        type: String,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    ordercredit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ordercredit'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required: true
    },
    paymentMethod : {
        type : String,
        enum : Paymentmethod1,
        required : true
    },
    subtotal: {
        type: Number,
        required: true
    },
    totalamount: {
        type: Number,
        required: true
    },
    orderitems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'orderitem'
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    createdat: {
        type: Date,
        default: new Date()
    },
},
    {
        timezone: 'Asia/Kolkata'
    }
)

module.exports = Orders = mongoose.model('order', OrderSchema);