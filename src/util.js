module.exports.displaydist = function displaydist(x) {
    if (x < 1000) {
        return x + 'm';
    } else {
        x /= 1000;
        return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 2 }).format(x) + 'km';
    }
}

module.exports.globals = function(req, res, next) {
    res.locals.logged_in = (typeof req.user !== 'undefined');
    res.locals.name = req.user ? req.user.name : '';
    res.locals.distance = req.user ? module.exports.displaydist(req.user.distance) : '';
    res.locals.csrf = req.csrfToken();
    next();
}
