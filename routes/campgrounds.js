const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync'); 
const Review = require('../models/review')
const CampGround = require('../models/campground')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require("../controllers/campground")
const multer  = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({storage})

router.route('/')
    .get(catchAsync(campgrounds.indexCampgrounds))
    .post(isLoggedIn, upload.array('image'), campgrounds.validateCampground, catchAsync(campgrounds.createCampground))
    
router.get('/new',isLoggedIn, campgrounds.renderNewCampground)
router.get('/book/:id', campgrounds.bookCamping)
router.get('/edit/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditCampground))

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, upload.array('image'), campgrounds.validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


module.exports = router;