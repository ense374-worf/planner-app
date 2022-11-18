const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendStatus(200);
});

router.get('/:semId', (req, res) => {
    res.sendStatus(200);
});

module.exports = router;