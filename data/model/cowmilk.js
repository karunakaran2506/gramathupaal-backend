const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CowMilkSchema = new Schema({
    session: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    entrydate: {
        type: Date,
        required: true
    },
    cow: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cow'
    },
    createdat: {
        type: Date,
        required: true,
        default: new Date()
    }

})

module.exports = CowMilk = mongoose.model('cowmilk', CowMilkSchema);