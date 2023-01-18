const mongoose = require('mongoose');
const { MedicineCategory } = require('../common/constants');
const Schema = mongoose.Schema;

const MedicineSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum : MedicineCategory,
        required : true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'store'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdat: {
        type: Date,
        default: new Date(),
        required: true
    }

})

module.exports = Medicine = mongoose.model('medicine', MedicineSchema);