const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CowTreatmentSchema = new Schema({
    cow: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'cow'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'store'
    },
    problem: {
        type: String,
        required: true
    },
    prescription: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: false,
        default: null
    },
    entrydate: {
        type: Date,
        required: true
    },
    createdat: {
        type: Date,
        required: true,
        default: new Date()
    }

})

module.exports = CowTreatment = mongoose.model('cowtreatment', CowTreatmentSchema);