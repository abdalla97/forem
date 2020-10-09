const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        id:{
            type: String
        }, 
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        photoURL: {
            type: String,
        },
        year: {
            type: String,
            required: true
        },
        major: {
            type: String,
            required: true
        },
        college: {
            type: String,
            required: true
        },
        university: {
type: String, 
required: true
        }
     }
)

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
