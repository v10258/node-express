
var fortune = require('../lib/fortune.js');

exports.home = function(req, res, next) {
    app.render('home');
};

exports.about = function(req, res) {
    res.render('about', {
        fortune: fortune.getFortune()
    });
};