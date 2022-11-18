const mongoose = require('mongoose');

const ClassSchema = require('./Class').Schema;

const AssignmentSchema = new mongoose.Schema({
    name: String,
    desc: String,
    due: Date,
    progress: Number,
    class: ClassSchema,
    created: {
        type: Date,
        default: Date.now
    },
});

const Assignment = mongoose.model('Assignment', AssignmentSchema);

module.exports = {Model: Assignment, Schema: AssignmentSchema};