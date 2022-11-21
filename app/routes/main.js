const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/User').Model;

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

router.get('/about-us', (req, res) => {
    res.render('about-us');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

module.exports = router;