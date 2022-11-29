const mongoose = require('mongoose');

const SemesterSchema = new mongoose.Schema({
    name: String,
    user: mongoose.Schema.Types.ObjectId,
    created: {
        type: Date,
        default: Date.now
    },
});

const Semester = mongoose.model('Semester', SemesterSchema);

module.exports = Semester;