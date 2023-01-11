const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CalfDeliverySchema = new Schema({
    cow: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'cow'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'store'
    },
    gender: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true,
        default: 0
    },
    comment: {
        type: String,
        required: false
    },
    entrydate: {
        type: Date,
        required: true
    },
    createdat: {
        type: Date,
        required: true,
        default: new Date()
    }

})

module.exports = CalfDelivery = mongoose.model('calfdelivery', CalfDeliverySchema);