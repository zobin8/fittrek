var express = require('express');
var router = express.Router();

router.get('/privacy', function(req, res, next) {
    res.render('privacy');
});

router.get('/delete', function(req, res, next) {
    res.render('delete');
});


module.exports = router;
