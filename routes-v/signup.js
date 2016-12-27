var express = require('express');
var router = express.Router();
var formidable = require('formidable');

var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
  res.render('signup', {
    layout: 'auth'
  });
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
  var form = new formidable.IncomingForm();
  var outputDir = 'upload/avatar';

  form.uploadDir = __dirname + '/data/temp';
  form.parse(req, function(err, fields, files) {
    if (err) return res.redirect(303, '/error');

    var photo = files.photo;
    var newName = uuid.v1().replace(/-/g, '');
    var extName = photo.name.slice(photo.name.lastIndexOf('.'));
    fs.renameSync(photo.path, outputDir + '/' + newName + extName);

    return res.redirect(303, '/thank-you');
  });
})

module.exports = router;