const express = require('express');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Review = require('../models/review')
const CampGround = require('../models/campground')
const { reviewSchema } = require('../schemas')
const router = express.Router({mergeParams: true});
const { isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/review')

 const validateReview = (req,res,next)=>{
    const { error } = reviewSchema.validate(req.body);
    if(error){
      const msg = error.details.map(el => el.message).join(',');
      throw new AppError(msg, 404);
    } else{
      next();
    }
  }




router.delete('/:revId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteRev))
  
  router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createRev))

  module.exports = router;