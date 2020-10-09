const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');

const secret = process.env.SECRET;

const UserModel = require('../models/UserModel');

router.post(
    '/register',
    (req, res) => {
        const formData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            university: req.body.university, 
            college: req.body.college, 
            major: req.body.major, 
            year: req.body.year, 
            photoURL: ''
        };

        // 1. Make sure email is unique
        UserModel
        .findOne({ email: req.body.email })
        .then(
            async (document)=> {
                // if document exists, they already have an account
                // so reject registration
                if(document) {
                    res.send({msg: "An account with that email exists"})
                }

                // otherwise, they are a new user so create their account
                else {
                    // 2. Extract password
                    const newUser = new UserModel(formData);

                    // 4. Upload the user's avatar
                    const files = Object.values(req.files);

                    await cloudinary.uploader.upload(
                        files[0].path,
                        (cloudinaryResult, err) => {
                            console.log('cloudinaryResult', cloudinaryResult);
                            // Then include the photoURL in formData
                            newUser.photoURL = cloudinaryResult.url
                        }
                    )

                    // 3. Generate salt
                    bcrypt.genSalt(
                        (err, salt) => {
                            
                            // 4. Use salt and password to create encrypted password
                            bcrypt.hash(
                                newUser.password,
                                salt,
                                (err, encryptedPassword) => {
                                    // 5. Replace password with encryption in formData
                                    newUser.password = encryptedPassword;

                                    // 6. Save formData in MongoDB
                                    newUser
                                    .save()
                                    .then(
                                        (document) => {
                                            console.log('document', document)
                                            res.send(document);
                                        }
                                    )
                                    .catch(
                                        (e) => {
                                            console.log('error', e);
                                            res.send({ e: e })
                                        }
                                    )
                                }
                            )

                        }
                    )
                }
            }
        )
    }
);


router.post('/updateUser', (req, res) => {

    UserModel.findById(req.user.id, function (err, user) {

       

        if (!user) {
            res.send({msg: "no account found"})
        }

        // good idea to trim 
        const formData = {
            firstName: req.body.firstName.trim(),
            lastName: req.body.lastName.trim(),
            email: req.body.email.trim(),
            password: req.body.password.trim(),
            photoURL: ''
        };

        // validate 
        if (!firstName || !lastName || !email || !password || photoURL) { // simplified: '' is a falsey
        res.send({msg: "one of the fields is empty"})
        }

        
        user.UserModel=formData
        // don't forget to save!
        user.save(function (err) {

            // todo: don't forget to handle err

            
        }).then(
            (document) => {
                console.log('document', document)
                res.send(document);
            }
        )
        .catch(
            (e) => {
                console.log('error', e);
                res.send({ e: e })
            }
        )
    });
});




router.post(
    '/login',
    (req, res) => {

        // 1. See if email has been send in POST request
        if(req.body.email) {
            UserModel
            .findOne({email: req.body.email})
            .then(
                (document) => {
                    // 2a. Check to see if email exists
                    if(document) {
                        // 3. If email correct, compare the password
                        bcrypt
                        .compare(req.body.password, document.password)
                        .then(
                            (passwordMatch)=> {
                                // 4a. If .compare() returns true, generate JWT
                                if(passwordMatch) {
                                    // 5. Creating a payload for JWT
                                    const payload = {
                                        id: document._id,
                                        email: document.email
                                    }

                                    // 6. Generate the JWT
                                    jwt.sign(
                                        payload, 
                                        secret,
                                        (err, theJWT) => {
                                            // 7. Send the JWT to client
                                            res.send({ token: theJWT })
                                        }
                                    ) 
                                }
                                // 4b. reject login
                                else {
                                    res.send({ msg: "Please check your email & password" })
                                }
                            }
                        )
                        .catch(
                            (e) => {
                                console.log('e', e)
                            }
                        )
                    } 
                    //2b. If email incorrect, reject login 
                    else {
                        res.send({ msg: "Please check your email & password" })
                    }
                }
            )
            .catch(
                (e) => {
                    console.log('e', e)
                    res.send({ e: e })
                }
            )
        }
    }
);

router.post(
    '/imageUpload',
    (req, res) => {

        const files = Object.values(req.files);

        cloudinary.uploader.upload(
            files[0].path,
            (result, err) => {
                console.log(result);
                res.send(result);
            }
        )
    }
)


module.exports = router;