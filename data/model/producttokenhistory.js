const mongoose = require('mongoose');
const { Paymentmethod2 } = require('../common/constants');
const Schema = mongoose.Schema;

const TokenhistorySchema = new Schema({
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'user'
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    paymentMethod : {
        type : String,
        enum : Paymentmethod2,
        required : true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required: true
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'product'
    },
    soldby: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    createdat : {
        type : Date,
        required : true,
        default : new Date()
    }
})

module.exports = Tokenhistory = mongoose.model('tokenhistory', TokenhistorySchema);