const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliveryAvailablitySchema = new Schema({
    subscriptionpackorder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subscriptionpackorder',
        required: true
    },
    availablity: {
        type: Boolean,
        default: true,
        required: true
    },
    comments: {
        type: String,
        default: null
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

module.exports = DeliveryAvailablity = mongoose.model('deliveryavailablity', DeliveryAvailablitySchema);