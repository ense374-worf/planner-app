const express = require('express');
const router = express.Router();
const passport = require('passport');

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

router.get('/about-us', (req, res) => {
    res.render('about-us');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

module.exports = router;