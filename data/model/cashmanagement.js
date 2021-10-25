const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CashManagementSchema = new Schema({
    entrydate: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ["sales", "expenses"],
        default: null
    },
    amount: {
        type: Number,
        required: true
    },
    comment: {
        type: String
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'store'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdat: {
        type: Date,
        required: true,
        default: new Date()
    }
}, {
    timezone: 'Asia/Kolkata'
})

module.exports = CashManagement = mongoose.model('cashmanagement', CashManagementSchema);