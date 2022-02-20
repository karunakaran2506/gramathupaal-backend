const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VaccinationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
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

module.exports = Vaccination = mongoose.model('vaccination', VaccinationSchema);