const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeadsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique : true,
        required: true
    },
    email: {
        type: String,
        required: true,
        default: null
    },
    modeofreferral : {
        type: String,
        required: true
    },
    status : {
        type: String,
        required: true
    },
    comment : {
        type: String,
        required: true,
        default: null
    },
    store : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'store'
    },
    createdat : {
        type : Date,
        required : true,
        default : new Date()
    }
})

module.exports = Leads = mongoose.model('leads', LeadsSchema);