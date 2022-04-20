const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const User = require('./user')
const opts = { toJSON: { virtuals: true}};

const imageSchema = new Schema({
    url: String,
    path: String,
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_150');
})

const CampGroundSchema = new Schema({
    title: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    images:[imageSchema],   
    boosted: Boolean,
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
    author: {type: Schema.Types.ObjectId, ref: 'User'}
}, opts);

CampGroundSchema.virtual('properties.popUpMarker').get(function(){
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`
})
CampGroundSchema.virtual('properties.description').get(function(){
    return `${this.description.substring(0,45)}...`
})
CampGroundSchema.virtual('properties.price').get(function(){
    return `${this.price}`
})

CampGroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('CampGround', CampGroundSchema);
