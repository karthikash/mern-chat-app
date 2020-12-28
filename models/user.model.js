const { Schema, model } = require('mongoose');

const User = new Schema({
    sFirstName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 16
    },
    sLastName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 16
    },
    sUsername: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    sPassword: {
        type: String,
        required: true
    },
    sSalt: {
        type: String
    },
    sImage: {
        type: String
    },
    dLastSeen: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = model('User', User, 'User');