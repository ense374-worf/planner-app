const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Message = require('../models/Message');

router.get('/', (req, res) => {
    res.render('landing');
});

router.get('/login', (req, res) => {
    res.render('loginregister', {start: 'login'});
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));

router.get('/register', (req, res) => {
    res.render('loginregister', {start: 'register'});
});

router.post('/register', async (req, res) => {
    const {name, email, password, confirmPassword} = req.body;
    let errors = [];

    const emailRegex = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/;

    if(!name || !email || !password || !confirmPassword) errors.push('Please fill all fields');

    if(!emailRegex.test(email)) errors.push('Please enter a valid email');

    if(password.length < 8) errors.push('Password must be at least 8 characters long');

    if(password !== confirmPassword) errors.push('Passwords do not match');

    const emailInUse = (await User.countDocuments({email}) > 0);

    if(emailInUse) errors.push('Email is already in use');

    if(errors.length > 0){
        return res.render('loginregister',{
            start: 'register',
            errors
        });
    }

    bcrypt.genSalt(10, (err, salt) => {
        if(err) console.error(err);
        bcrypt.hash(password, salt, (err, hashPass) => {
            if(err) console.error(err);

            const newUser = new User({
                email,
                password: hashPass,
                name
            });

            newUser.save()
                .then(() => {
                    return res.render('loginregister',{
                        start: 'login',
                        message: 'Registration successful. You can now login'
                    });
                })
        });
    });
});

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if(err) return next(err);

        res.redirect('/');
    });
});

router.get('/about-us', (req, res) => {
    res.render('about-us');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.post('/contact', (req, res) => {
    const {name, email, subject, message} = req.body;

    let errors = [];

    if(!name || !email || !subject || !message) errors.push('Please fill all fields');

    if(errors.length > 0){
        return res.render('contact', {
            errors
        });
    }

    const newMessage = new Message({
        name,
        email,
        subject,
        message
    });

    newMessage.save()
        .then(() => {
            res.redirect('/contact');
        }).catch(err => console.error(err));
    
});

module.exports = router;