const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderitemSchema = new Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    quantity: {
        type: Number,
        required: true
    },
    totalamount: {
        type: Number,
        required: true
    },
    createdat: {
        type: Date,
        default: new Date(),
        required: true
    }

})

module.exports = Orderitem = mongoose.model('orderitem', OrderitemSchema);