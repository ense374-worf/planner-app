const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    fullname: String,
    created: {
        type: Date,
        default: Date.now
    }
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

module.exports = {Model: User, Schema: UserSchema};