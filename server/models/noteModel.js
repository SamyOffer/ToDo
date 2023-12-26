const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
        title: String,
        content: String,
        finished: Boolean
    }
);

module.exports = mongoose.model('Note', noteSchema);