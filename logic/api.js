const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req,res) => {
    res.sendFile(path.resolve('./home.html'));
});

//  Tema .4
router.get('/about', (req,res) => {
    res.sendFile(path.resolve('./about.html'));
});


router.use(express.static(__dirname + '/../public'));

module.exports = router;