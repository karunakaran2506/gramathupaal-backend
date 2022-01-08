const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderCreditSchema = new Schema({
    reason : {
        type : String,
        required : true
    },
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'user'
    },
    createdat : {
        type : Date,
        required : true,
        default : new Date()
    }

})

module.exports = OrderCredit = mongoose.model('ordercredit', OrderCreditSchema);