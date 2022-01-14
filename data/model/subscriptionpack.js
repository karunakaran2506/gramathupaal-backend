const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionpackSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    price: {
        type: Number,
        required: true
    },
    validity: {
        type: Number,
        required: true
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'product'
    },
    createdat : {
        type : Date,
        required : true,
        default : new Date()
    }
})

module.exports = Subscriptionpack = mongoose.model('subscriptionpack', SubscriptionpackSchema);