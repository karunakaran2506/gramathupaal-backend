const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = new Schema({

    name : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    email : {
        type : String
    },
    isactive : {
        type : Number,
        default : 1
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    createdat : {
        type : Date,
        default : new Date()
    }
})

module.exports = Stores = mongoose.model('store', StoreSchema);