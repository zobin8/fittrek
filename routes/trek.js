var express = require('express');
var createError = require('http-errors');
var router = express.Router();
var treks = require('../data/treks');
var progress = require('../models/progress');
var util = require('../src/util');

function setlocals(req, res, t, next) {
    res.locals.title = t.name;
    res.locals.trek = req.params['trek'];
    res.locals.image = "/public/images/" + t.image;
    res.locals.copyright = t.copyright;
    res.locals.maxdist = util.displaydist(t.dist);
    res.locals._maxdist = t.dist;
    res.locals.mapwidth = t.width;
    res.locals.mapheight = t.height;
    res.locals.checkpoints = [];

    if (req.user) {
        Progress.findOrCreate({openid: req.user.openid, trek: res.locals.trek}, {}, function (err, progress) {
            res.locals._balance = req.user.distance;
            res.locals._currdist = progress.distance;
            res.locals._apply = Math.min(res.locals._balance, res.locals._maxdist - res.locals._currdist);
            processlocals(req, res, t, next)
        });
    } else {
        res.locals._balance = 0;
        res.locals._currdist = 0;
        res.locals._apply = 0;
        processlocals(req, res, t, next);
    }
}

function processlocals(req, res, t, next) {
    res.locals.balance = util.displaydist(res.locals._balance);
    res.locals.apply = util.displaydist(res.locals._apply);
    res.locals.applypct = 100 * res.locals._apply / res.locals._maxdist;
    res.locals.currdist = util.displaydist(res.locals._currdist);
    res.locals.currpct = 100 * res.locals._currdist / res.locals._maxdist;
    res.locals.complete = res.locals._currdist == res.locals._maxdist;

    t.checkpoints.forEach((cpt, i) => {
        var dist = cpt.dist == 0 ? 'start' : util.displaydist(cpt.dist);
        var state = 0;
        if (res.locals.complete) {
            state = 3;
        } else if (req.user && res.locals._currdist >= cpt.dist) {
            state = 2;
        } else if (req.user && res.locals._currdist + res.locals._balance > cpt.dist) {
            state = 1;
        }
        res.locals.checkpoints.push({name: cpt.name, dist: dist, text: cpt.text, state: state});
    });

    next(req, res);
}

function applydist(req, res) {
    var query = {openid: req.user.openid, trek: res.locals.trek};
    Progress.findOrCreate(query, {}, function (err, progress) {
        if (err) {
            next(createError(500));
        } else {
            var applydist = req.user.distance;
            if (applydist + progress.distance > res.locals._maxdist) {
                applydist = res.locals._maxdist - progress.distance;
            }
            progress.distance += applydist;
            req.user.distance -= applydist;
            progress.save();
            req.user.save();
            res.redirect('/trek/view/' + res.locals.trek);
        }
    });
}

router.post('/apply/:trek', function(req, res, next) {
    var req_trek = req.params['trek'];
    
    if (!req.user) {
        next(createError(403));
        return;
    }
    if (!(req_trek in treks)) {
        next(createError(404));
        return;
    }

    var t = treks[req_trek];

    setlocals(req, res, t, applydist);
});

router.get('/view/:trek', async function(req, res, next) {
    var req_trek = req.params['trek'];

    if (!(req_trek in treks)) {
        next(createError(404));
        return;
    }

    var t = treks[req_trek];

    setlocals(req, res, t, (req, res) => res.render('trek'));
});

router.get('/data/:trek', function(req, res, next) {
    var req_trek = req.params['trek'];

    if (!(req_trek in treks)) {
        next(createError(404));
        return;
    }

    var t = treks[req_trek];

    setlocals(req, res, t, (req, res) => {
        let data = Object.assign({}, t);
        if (req.user) {
            data.currdist = res.locals._currdist;
            data.apply = res.locals._apply;
        } else {
            data.currdist = -1;
            data.apply = -1;
        }
        res.json(data);
    });
});

router.get('/data-all', function(req, res, next) {
    if (req.user) {
        let data = Object.assign({}, treks);
        Progress.find({openid: req.user.openid}, function (err, docs) {
            if (err) {
                next(createError(500));
                return;
            }
            for (var i = 0; i < docs.length; i++) {
                var doc = docs[i];
                data[doc.trek] = Object.assign({}, treks[doc.trek]);
                data[doc.trek].currdist = doc.distance;
                data[doc.trek].apply = Math.min(req.user.distance, data[doc.trek].dist - doc.distance);
            }
            res.json(data);
        });
    } else {
        res.json(treks);
    }
});

module.exports = router;
