const mongoose = require('mongoose');
const { Paymentmethod2 } = require('../common/constants');
const Schema = mongoose.Schema;

const SubscriptionhistorySchema = new Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    price: {
        type: Number,
        required: true
    },
    // paymentMethod : {
    //     type : String,
    //     enum : Paymentmethod2,
    //     default : null
    // },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required: true
    },
    subscriptionpack: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'subscriptionpack'
    },
    createdat : {
        type : Date,
        required : true,
        default : new Date()
    }
})

module.exports = Subscriptionhistory = mongoose.model('subscriptionhistory', SubscriptionhistorySchema);