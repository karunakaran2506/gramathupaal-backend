const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductTokenSchema = new Schema({
    quantity: {
        type: Number,
        required: true
    },
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'user'
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'product'
    },
    store : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'store'
    },
    createdat : {
        type : Date,
        required : true,
        default : new Date()
    }
})

module.exports = ProductToken = mongoose.model('producttoken', ProductTokenSchema);