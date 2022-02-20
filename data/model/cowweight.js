const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CowWeightSchema = new Schema({
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

module.exports = CowWeight = mongoose.model('cowweight', CowWeightSchema);