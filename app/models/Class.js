const mongoose = require('mongoose');

const SemesterSchema = require('./Semester').Schema;

const ClassSchema = new mongoose.Schema({
    name: String,
    prof: String,
    location: String,
    semester: SemesterSchema,
    created: {
        type: Date,
        default: Date.now
    },
});

const Class = mongoose.model('Class', ClassSchema);

module.exports = {Model: Class, Schema: ClassSchema};