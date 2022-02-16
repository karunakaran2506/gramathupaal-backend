const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MilkSupplySchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required : true
    },
    quantity: {
        type: Number,
        required: true
    },
    deliveryman: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'store'
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

module.exports = MilkSupply = mongoose.model('milksupply', MilkSupplySchema);