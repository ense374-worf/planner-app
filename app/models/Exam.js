const mongoose = require('mongoose');

const ClassSchema = require('./Class').Schema;

const ExamSchema = new mongoose.Schema({
    name: String,
    desc: String,
    datetime: Date,
    class: ClassSchema,
    created: {
        type: Date,
        default: Date.now
    },
});

const Exam = mongoose.model('Exam', ExamSchema);

module.exports = {Model: Exam, Schema: ExamSchema};