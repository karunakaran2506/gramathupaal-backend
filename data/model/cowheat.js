const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CowHeatSchema = new Schema({
    description: {
        type: String,
        required: false,
        default: null
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

module.exports = CowHeat = mongoose.model('cowheat', CowHeatSchema);