const express = require('express');
const router = express.Router();

const {verifyAuthentication} = require('../auth');

router.get('/', verifyAuthentication, (req, res) => {
    res.sendStatus(200);
});

router.get('/:semId', verifyAuthentication, (req, res) => {
    res.sendStatus(200);
});

module.exports = router;