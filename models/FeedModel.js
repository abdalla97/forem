const mongoose = require('mongoose');

const FeedSchema = new mongoose.Schema(
    {

        username: {
            type: String,
            required: true
        },
        userid: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        courseCode: {
            type: String,
            required: true
        }, 
        photoURL: {
            type: String,
        }
    }
);

const FeedModel = mongoose.model('feeds', FeedSchema);

module.exports = FeedModel;