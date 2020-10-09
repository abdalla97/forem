const express = require('express');
const router = express.Router();

const FeedModel = require('../models/FeedModel');
const CourseModel = require('../models/CourseModel'); 

router.post(
    '/post', // http://localhost:3001/feeds/
    (req, res) => {
        const formData = {
            description: req.body.description,
            rating: req.body.rating
        };

        const newFeed = new FeedModel(formData);

        newFeed
        .save()
        .then(
            (document) => {
                res.send(document)
            }
        )
        .catch(
            (e) => {
                console.log('e', e)
                res.send(e)
            }
        )
    }
)


router.get(
    '/get',
    (req, res)=>{

        if(req.query.code) {
           
            CourseModel
            .find({code: req.query.code})
            .then(
                (document) => {
                    res.send(document)
                }
            )
            .catch(
                (e) => {
                    console.log('error', e);
                    res.send({ e: e })
                }
            )
        }
        else {
          
            CourseModel
            .find()
            .then(
                (document) => {
                    res.send(document)
                }
            )
            .catch(
                (e) => {
                    console.log('error', e)
                }
            )
        }
    }
);

router.post(
    '/image-upload',
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