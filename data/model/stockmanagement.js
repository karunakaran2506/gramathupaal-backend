const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockManagementSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required : true
    },
    stocktype :{
        type: String,
        enum : ['in', 'out'],
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
        enum: ['milk', 'others'],
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