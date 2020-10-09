const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        postid: {
            type: String,
            required: true
        }, 
        commentid: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
    }
);

const courseModel = mongoose.model('comments', CommentSchema);

module.exports = commentModel;