const mongoose = require('mongoose');
const { Categorytype, Stocktype} = require('../common/constants');
const Schema = mongoose.Schema;

const StockManagementSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required : true
    },
    stocktype :{
        type: String,
        enum : Stocktype,
        required : true
    },
    quantity: {
        type: Number,
        required: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required : true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order'
    },
    producttype : {
        type : String,
        enum: Categorytype,
        required : true
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
}, {
    timezone: 'Asia/Kolkata'
})

module.exports = StockManagement = mongoose.model('stockmanagement', StockManagementSchema);