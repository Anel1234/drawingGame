const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('userName', UserSchema);