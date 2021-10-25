const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({

    orderid: {
        type: String,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required: true
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