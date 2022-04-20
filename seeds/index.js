
const mongoose = require('mongoose');
const cities = require('./cities')
const CampGround = require('../models/campground')
const {descriptors} = require('./seedhelpers')
const {places} = require('./seedhelpers')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: 'pk.eyJ1Ijoicm9zbGFubGJ6byIsImEiOiJjbDFvM3V3d2MwaDAwM2NtdHFmbnNybDZ5In0.PIrnQ7rvOqXAj9Yp-vK5Lg'})



main(console.log('Hello! Mongo working here ')).catch(err => console.log(err, 'Mongoose connection not working :('));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
}


const makeGrounds = async () => {
    await CampGround.deleteMany({})
    for(let i = 0; i <350; i++){
     
        const random1000 = Math.floor(Math.random()*1000)
        const randPrice = Math.floor(Math.random()*50) + 10
        const randomTitle = array => array[Math.floor(Math.random()* array.length)]
        const rand10 = Math.floor(Math.random()*10)
        const BoostedFactor = function boostedOrNot(rand10){
          if (rand10 >= 8){
            return true
          } else {
            return false
          }
        }
        const camp = new CampGround({
location: `${cities[random1000].city}, ${cities[random1000].state}`,
title: `${randomTitle(descriptors)} ${randomTitle(places)}`,
images: [
  {
    url: 'https://res.cloudinary.com/dyxbpfky6/image/upload/v1648198599/YelpCamp/axfdaeu0pbalcjiyyk1r.jpg',
    path: 'YelpCamp/axfdaeu0pbalcjiyyk1r',
  },
  {
    url: 'https://res.cloudinary.com/dyxbpfky6/image/upload/v1648198600/YelpCamp/btnjgrxfesxhtkgq0dos.jpg',
    path: 'YelpCamp/btnjgrxfesxhtkgq0dos',
  },
  {
    url: 'https://res.cloudinary.com/dyxbpfky6/image/upload/v1648198600/YelpCamp/kshq6p5ktpek0h5ntzkt.jpg',
    path: 'YelpCamp/kshq6p5ktpek0h5ntzkt',
  },
  {
    url: 'https://res.cloudinary.com/dyxbpfky6/image/upload/v1648198601/YelpCamp/brekmc0iartux5l3qrah.jpg',
    path: 'YelpCamp/brekmc0iartux5l3qrah',
  },
  {
    url: 'https://res.cloudinary.com/dyxbpfky6/image/upload/v1648198602/YelpCamp/s3t6t0ft4mclixcx392m.jpg',
    path: 'YelpCamp/s3t6t0ft4mclixcx392m',
  }
],
description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum non suscipit, doloremque quia cupiditate incidunt recusandae corporis et rem sint perferendis repellat maiores quis saepe commodi facere odio quam officiis.",
price: randPrice,
boosted: BoostedFactor(rand10),
author: '6239cdf3c379fa22b6d1f37b'
        })
        
        const geoData = await geocoder.forwardGeocode({
          query: camp.location,
          limit: 1
        }).send()
        camp.geometry = geoData.body.features[0].geometry
        await camp.save();

    }

    console.log('campgrounds created succesfully')
}
makeGrounds();