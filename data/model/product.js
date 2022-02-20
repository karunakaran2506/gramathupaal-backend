const mongoose = require('mongoose');
const { Milktype, Units, Categorytype } = require('../common/constants');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Categorytype,
        required: true
    },
    milktype: {
        type: String,
        enum: Milktype,
        default: null
    },
    description: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'store'
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        enum: Units,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    // 1 is the default number for active
    isactive: {
        type: Number,
        required: true,
        default: 1
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

module.exports = Product = mongoose.model('product', ProductSchema);