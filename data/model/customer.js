const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    name : {
        type : String,
        require : true
    },
    phone : {
        type : String,
        require : true,
        unique : true
    },
    email : {
        type : String,
        require : true
    },
    location : {
        type : String,
        require : true
    },
    created_at: {
		type: Date,
		required: true,
		default: new Date()
	}

})

module.exports = Customers = mongoose.model('customer', CustomerSchema);