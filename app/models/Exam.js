const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    name: String,
    desc: String,
    datetime: Date,
    class: mongoose.Schema.Types.ObjectId,
    created: {
        type: Date,
        default: Date.now
    },
});

const Exam = mongoose.model('Exam', ExamSchema);

module.exports = Exam;