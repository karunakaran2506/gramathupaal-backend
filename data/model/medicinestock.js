const mongoose = require('mongoose');
const { MedicineStocktype } = require('../common/constants');
const Schema = mongoose.Schema;

const MedicineStockSchema = new Schema({
    store: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'store'
    },
    medicine: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'medicine'
    },
    quantity: {
        type: Number,
        required: true
    },
    stocktype: {
        type: String,
        enum: MedicineStocktype,
        required: true,
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

module.exports = MedicineStock = mongoose.model('medicinestock', MedicineStockSchema);