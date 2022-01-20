const mongoose = require('mongoose');
const { Usertypes } = require('../common/constants');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    name : {
        type : String,
        require : true
    },
    phone : {
        type : String,
        require : true,
        unique : true
    },
    password: {
		type: String,
		require: true
	},
    email : {
        type : String,
        default : null
    },
    isdeleted : {
        type : Number,
        default : 0
    },
    otp : {
        type : String,
        default : null
    },
    forgetotp :{
        type : String,
        default : null
    },
    userimage:{
        type : String,
        default : null
    },
    role : {
        type : String,
        enum : Usertypes,
        required : true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store'
    },
    adhar:{
        type: String,
        default: null
    },
    nickname : {
        type : String,
        require : true,
        default: null
    },
    customeraddress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'customeraddress'
        }
    ],
    player_id:{
		type: String,
		default:null
	},
    createdat: {
		type: Date,
		required: true,
		default: new Date()
	}
})

module.exports = Users = mongoose.model('user', UserSchema);