const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        coursecode: {
            type: String,
            required: true
        }, 
        courseid: {
            type: String, 
            required: true
        }
    }
);

const courseModel = mongoose.model('courses', CourseSchema);

module.exports = courseModel;