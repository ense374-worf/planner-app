const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    name: String,
    prof: String,
    location: String,
    color: String,
    semester: mongoose.Schema.Types.ObjectId,
    created: {
        type: Date,
        default: Date.now
    },
});

const Class = mongoose.model('Class', ClassSchema);

module.exports = Class;