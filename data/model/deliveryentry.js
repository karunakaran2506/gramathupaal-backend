const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliveryEntrySchema = new Schema({
    subscriptionpackorder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subscriptionpackorder',
        required: true
    },
    isdelivered: {
        type: Boolean,
        required: true
    },
    deliveredby: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    entrydate: {
        type: Date,
        required: true
    },
    createdat: {
        type: Date,
        default: new Date(),
        required: true
    }
})

module.exports = DeliveryEntry = mongoose.model('deliveryentry', DeliveryEntrySchema);