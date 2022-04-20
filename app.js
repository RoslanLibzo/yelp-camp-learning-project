if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');
const Joi = require('@hapi/joi')
const mongoose = require('mongoose');
const CampGround = require('./models/campground')
const methodOverride = require('method-override');
const { url } = require('inspector');
const { urlencoded } = require('body-parser');
const engine = require('ejs-mate')
const AppError = require('./utils/appError')
const catchAsync = require('./utils/catchAsync'); 
const { string, number, boolean } = require('joi');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')
const mongoSanitize = require("express-mongo-sanitize");

const MongoStore = require("connect-mongo");

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')



// 'mongodb://localhost:27017/yelp-camp'
// const dbUrl = process.env.DB_URL
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'

async function main() {
  await mongoose.connect(dbUrl);
}
main(console.log('Hello! Mongo working here ')).catch(err => console.log(err, 'Mongoose connection not working :('));

app.engine('ejs',engine)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());


const secret = process.env.SECRET || 'backupsecret'
const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: secret,
  touchAfter: 24 * 60 * 60
});

store.on('error', function(e){
  console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
  store,
  name: 'session',
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
   // secure: true,
    expires: Date.now() + 1000* 60 * 60 * 24 *7,
    maxAge: 1000*60*60*24*7,
  }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.notyet = req.flash('notyet');
  next();
})


app.use('', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/fakeuser', async(req,res)=>{
  const user = new User({email: 'ascaokcasok@gmail.com', username: "FlyingCows"})
  const newUser = await User.register(user, 'chickens')
  console.log(user)

})

app.get('/', (req,res)=>{
    res.render("home.ejs")
})

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`serving on port ${port}`)
})



  
app.all('*',(req,res,next) => {
next(new AppError("This page doesn't exist", 404))
})

app.use((err, req, res, next)=> {
  const { statusCode = 500, message = "Something Went Wrong"} = err
  res.render('error.ejs', { statusCode , message , err} )
})