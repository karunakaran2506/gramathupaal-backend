const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomeraddressSchema = new Schema({
    addressline1: {
        type: String,
        require: true
    },
    addressline2: {
        type: String,
        default: null,
        require: true
    },
    area: {
        type: String,
        require: true
    },
    pincode: {
        type: String,
        require: true
    },
    landmark: {
        type: String,
        default: null,
        require: true
    },
    city: {
        type: String,
        default: null,
        require: true
    },
    state: {
        type: String,
        default: null,
        require: true
    },
    country: {
        type: String,
        default: null,
        require: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    created_at: {
        type: Date,
        required: true,
        default: new Date()
    }

})

module.exports = Customeraddress = mongoose.model('customeraddress', CustomeraddressSchema);