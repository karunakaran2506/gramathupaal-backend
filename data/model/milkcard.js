const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MilkcardSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    price: {
        type: Number,
        required: true
    },
    validity: {
        type: Number,
        required: true
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'product'
    },
    isdeleted : {
        type : Number,
        default : 0
    },
    createdat : {
        type : Date,
        required : true,
        default : new Date()
    }
})

module.exports = Milkcard = mongoose.model('milkcard', MilkcardSchema);