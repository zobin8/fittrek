var express = require('express');
var router = express.Router();
var treks = require('../data/treks');
var util = require('../src/util')

router.get('/', function(req, res, next) {
    res.locals.treks = []

    for (var name in treks) {
        t = treks[name];
        var trek = {};
        trek.name = t.name;
        trek.href = '/trek/view/' + name;
        trek.trek = name;
        trek.img = '/public/images/' + t.image;
        trek.maxdist = util.displaydist(t.dist);
        trek.width = t.width;
        trek.height = t.height;
        trek.copyright = t.copyright;
        res.locals.treks.push(trek);
    }
    
    res.render('index');
});

module.exports = router;
