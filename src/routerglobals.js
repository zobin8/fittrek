var util = require('./util');

globals = function(req, res, next) {
    res.locals.logged_in = (typeof req.user !== 'undefined');
    res.locals.name = req.user ? req.user.name : '';
    res.locals.distance = req.user ? util.displaydist(req.user.distance) : '';
    res.locals.csrf = req.csrfToken();
    next();
}

module.exports.globals = globals;
