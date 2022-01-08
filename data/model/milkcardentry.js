const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MilkcardentrySchema = new Schema({
    validity: {
        type: Number,
        required: true
    },
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'user'
    },
    milkcard : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'milkcard'
    },
    createdat : {
        type : Date,
        required : true,
        default : new Date()
    }
})

module.exports = Milkcardentry = mongoose.model('milkcardentry', MilkcardentrySchema);