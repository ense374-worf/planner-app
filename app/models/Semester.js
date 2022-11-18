const mongoose = require('mongoose');

const UserSchema = require('./User').Schema;

const SemesterSchema = new mongoose.Schema({
    name: String,
    user: UserSchema,
    created: {
        type: Date,
        default: Date.now
    },
});

const Semester = mongoose.model('Semester', SemesterSchema);

module.exports = {Model: Semester, Schema: SemesterSchema};