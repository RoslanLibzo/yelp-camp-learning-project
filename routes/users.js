const express = require("express");
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/user')

router.get('/register', (req, res)=>{
    res.render('users/register.ejs')

})

router.route('/login')
  .get(users.loginPage)
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.loginUser) 

router.post('/register', catchAsync(users.createNewUser))
router.get('/logout', users.logoutUser)

module.exports = router;