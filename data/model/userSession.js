const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSessionSchema = new Schema({

    entrydate: {
        type: Date,
        required: true
    },
    sessiontype: {
        type: String,
        enum: ['in', 'out'],
        required: true
    },
    sessiontime: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required: true
    },
    createdat: {
        type: Date,
        default: new Date()
    },
},
    {
        timezone: 'Asia/Kolkata'
    }
)

module.exports = UserSession = mongoose.model('usersession', UserSessionSchema);