const User = require('../models/user')

module.exports.createNewUser = async(req, res)=>{
    try{
    const { username, password, email } = req.body
    const user = await new User({username, email})
    const newUser = await User.register(user, password)
    req.login(newUser, err => {
        if(err) return next(err);
        req.flash('success', `Account created successfully,  welcome to campgrounds ${username}!`)
        res.redirect('/campgrounds')
    })
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.loginPage = (req,res)=>{
    res.render('users/login.ejs')
}

module.exports.loginUser = (req,res)=>{
    const { username } = req.body
    req.flash('success', `Welcome back ${username}`)
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logoutUser = (req, res)=>{
    req.logout();
    req.flash('success', 'Bye, logged out succesfully')
    res.redirect('/campgrounds');
}