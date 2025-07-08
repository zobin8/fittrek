const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema(
    {
        openid: {
            type: String,
            required: true
        },
        trek: {
            type: String,
            required: true
        },
        distance: {
            type: Number,
            default: 0
        }
    }
);

ProgressSchema.index({openid: 1, trek: 1}, {unique: true});

module.exports = Progress = mongoose.model("progress", ProgressSchema);
