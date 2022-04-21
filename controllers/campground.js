const CampGround = require("../models/campground");
const { campgroundSchema } = require("../schemas");
const AppError = require('../utils/appError');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken})


module.exports.showCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");

  if (!campground) {
    req.flash("error", "No matching campground found!");
    res.redirect("/campgrounds");
  }
  const { reviews } = campground;

  res.render("campgrounds/show.ejs", { campground, reviews });
};

module.exports.renderEditCampground = async (req, res, next) => {
  const foundCampground = await CampGround.findById(req.params.id);
  res.render("campgrounds/edit", { foundCampground });
};

module.exports.createCampground = async (req, res, next) => {
  console.log(req.body)
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send()
console.log(geoData.body.features[0].geometry)
  const { campground } = req.body;
  const images = req.files.map(f=>({url: f.path, path: f.filename }))
  const camp = await new CampGround(campground);
  camp.geometry = geoData.body.features[0].geometry
  camp.author = req.user._id;
  camp.images = images
  await camp.save();
  console.log(camp)
  req.flash("success", "Successfully created a new campground");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.validateCampground = (req, res, next) => {
  console.log(req.body)
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 404);
  } else {
    next();
  }
};

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await CampGround.findByIdAndUpdate(id, {...req.body.campground})
  const addedImages = req.files.map(f=>({url: f.path, path: f.filename}))
  campground.images.push(...addedImages)
  if(!req.body.campground.boosted){
    campground.boosted = false
  }
  await campground.save()
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    }
    console.log(req.body.deleteImages)
  await campground.updateOne({$pull: {images: {path: {$in: req.body.deleteImages } } } } )
  }
  req.flash('success', 'Campground updated Succesfully!')
  res.redirect(`/campgrounds/${id}`)
};

module.exports.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  await CampGround.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};

module.exports.indexCampgrounds = async (req, res, next) => {
  const campgrounds = await CampGround.find({});
  res.render("campgrounds/index.ejs", { campgrounds });
};

module.exports.renderNewCampground = (req, res) => {
  res.render("campgrounds/new.ejs");
};

module.exports.bookCamping = (req, res) => {
  const { id } = req.params
  req.flash("notyet", "This Feature is Not added yet :( SORRY")
  res.redirect(`/campgrounds/${id}`)
};

