
const AppError = require('./utils/appError')
const Review = require('./models/review')
const CampGround = require('./models/campground')



module.exports.isLoggedIn = (req, res, next)=>{
if (!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl;
    req.flash('error',"You need to be logged in!");
    return res.redirect('/login')
  }
  next()
}

module.exports.isAuthor = async(req, res, next)=>{
  const { id } = req.params
  const campground = await CampGround.findById(id)
  if (!campground.author.equals(req.user._id)){
    req.flash('error', "You don't have permission to do that!")
    return res.redirect(`/campgrounds/${id}`)
  } else{ next()}
}





module.exports.isReviewAuthor = async(req, res, next)=>{
  const { revId, id } = req.params
  const review = await Review.findById(revId)
  if (!review.author.equals(req.user._id)){
    req.flash('error', "You don't have permission to do that!")
    return res.redirect(`/campgrounds/${id}`)
  } else{ next()}
}