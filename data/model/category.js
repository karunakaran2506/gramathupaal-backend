const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name : {
        type : String,
        required : true
    },
    categorytype : {
        type : String,
        enum : ['milk', 'others'],
        default : 'others',
        required : true
    },
    isactive : {
        type : Number,
        default : 1
    },
    store : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'store'
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    createdat : {
        type : Date,
        required : true,
        default : new Date()
    }

})

module.exports = Category = mongoose.model('category', CategorySchema);