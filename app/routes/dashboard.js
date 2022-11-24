const express = require('express');
const router = express.Router();

const {verifyAuthentication} = require('../passport/auth');

router.get('/', verifyAuthentication, (req, res) => {
    res.render('dashboard/semesterSelect');
});

router.get('/new', verifyAuthentication, (req, res) => {
    res.render('dashboard/newSemester');
});

router.get('/:semId', verifyAuthentication, (req, res) => {
    res.render('dashboard/dashboard');
});

router.get('/:semId/editClasses', verifyAuthentication, (req, res) => {
    res.render('dashboard/editClasses');
});

module.exports = router;