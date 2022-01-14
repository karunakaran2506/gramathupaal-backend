const mongoose = require('mongoose');
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
        enum : ['Superadmin', 'Storeclerk', 'Customer', 'Deliveryman'],
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