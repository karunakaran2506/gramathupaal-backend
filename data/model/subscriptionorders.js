const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionpackorderSchema = new Schema({
    validity: {
        type: Number,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    customeraddress: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'customeraddress'
    },
    subscriptionpack: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'subscriptionpack'
    },
    deliveryman: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'store'
    },
    createdat: {
        type: Date,
        required: true,
        default: new Date()
    }
})

module.exports = Subscriptionpackorder = mongoose.model('subscriptionpackorder', SubscriptionpackorderSchema);