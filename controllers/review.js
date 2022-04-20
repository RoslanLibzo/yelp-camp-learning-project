const Review = require('../models/review')
const CampGround = require('../models/campground')

module.exports.deleteRev = async(req,res,next)=>{
    const { id , revId } = req.params
    
    await Review.findByIdAndDelete(revId)
    await CampGround.findByIdAndUpdate(id,{$pull:{reviews: revId}})
    res.redirect(`/campgrounds/${id}`)
  }

  module.exports.createRev = async(req,res)=>{
    const { id } = req.params
    const foundcampground = await CampGround.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    foundcampground.reviews.push(review);
    await review.save();
    await foundcampground.save();
    res.redirect(`/campgrounds/${id}`)
  }