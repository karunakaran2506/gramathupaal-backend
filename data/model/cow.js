const mongoose = require('mongoose');
const { CowGender, CowType } = require('../common/constants');
const Schema = mongoose.Schema;

const CowSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: CowGender,
        required: true
    },
    type: {
        type: String,
        enum: CowType,
        required: true
    },
    tagnumber: {
        type: String,
        required: true
    },
    mothercowname: {
        type: String,
        default: null
    },
    mothercownumber: {
        type: String,
        default: null
    },
    fathercowname: {
        type: String,
        default: null
    },
    fathercownumber: {
        type: String,
        default: null
    },
    dateofbirth: {
        type: Date,
        default: null
    },
    timeofbirth: {
        type: String,
        default: null
    },
    birthweight: {
        type: Number,
        default: null
    },
    dateofdewarming: {
        type: Date,
        default: null
    },
    dateoffirstfeedtaken: {
        type: Date,
        default: null
    },
    dateofmilkstop: {
        type: Date,
        default: null
    },
    dateoffirstheat: {
        type: Date,
        default: null
    },
    dateofinsemination: {
        type: Date,
        default: null
    },
    // treatment 
    stomachcleaning: {
        type: Boolean,
        default: false
    },
    calciumintake: {
        type: Boolean,
        default: false
    },
    brownsugar: {
        type: Boolean,
        default: false
    },
    //
    colostrummilkweight: {
        type: Number,
        default: null
    },
    dateofnormalmilk: {
        type: Date,
        default: null
    },
    dateoffirstheataftercalving: {
        type: Date,
        default: null
    },
    dateofartificialinsemination: {
        type: Date,
        default: null
    },
    dateofpregnancyconfirmation: {
        type: Date,
        default: null
    },
    dateofcalving: {
        type: Date,
        default: null
    },
    // connected entities
    cowweight: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'cowweight'
        }
    ],
    vaccination: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'vaccination'
        }
    ],
    cowmilk: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'cowmilk'
        }
    ],
    //
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdat: {
        type: Date,
        required: true,
        default: new Date()
    }

})

module.exports = Cow = mongoose.model('cow', CowSchema);