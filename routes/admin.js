var formidable = require('formidable');
var uuid = require('node-uuid');
var fs = require('fs');

exports.signin = function(req, res) {
    res.render('signin', {
        csrfToken: req.csrfToken()
    });
};


exports.home = function(req, res) {
    
    res.render('home');
}


exports.processSignin = function(req, res) {
    if (req.body.email && req.body.password) {
        res.redirect('/admin');
    }
}


/*exports.login = function(req, res){
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/data/temp';
    form.parse(req, function(err, fields, files) {
        if (err) return res.redirect(303, '/error');

        if(err) { 
            res.session.flash = {
                type: 'danger',
                intro: 'Oops!',
                message: 'There was an error'
            }
            return res.redirect(303, '/contest/vacation-photo');
        }

        var photo = files.photo;
        var newName = uuid.v1().replace(/-/g,'');
        var extName = photo.name.slice(photo.name.lastIndexOf('.'));
        fs.renameSync(photo.path, outputDir + '/' + newName + extName);

        //
        //saveContestEntry('vacation-photo', fields.email, req.params.year, req.params.month, path);

        req.session.flash = {
            type: 'success',
            intro: 'Good luck!',
            message: 'Your hava been entered into the contest'
        };

        return res.redirect(303, '/thank-you');
    });
}*/