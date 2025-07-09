var express = require('express');
var router = express.Router();

router.get('/privacy', function(req, res) {
    res.render('privacy');
});

router.get('/delete', function(req, res) {
    res.render('delete');
});


module.exports = router;
