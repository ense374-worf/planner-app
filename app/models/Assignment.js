const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    name: String,
    desc: String,
    estimatedDays: Number,
    due: Date,
    progress: {
        type: Number,
        default: 0
    },
    class: mongoose.Schema.Types.ObjectId,
    created: {
        type: Date,
        default: Date.now
    },
});

const Assignment = mongoose.model('Assignment', AssignmentSchema);

module.exports = Assignment;