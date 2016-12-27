var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });


var routes = {
    admin: require('./admin.js'),
    frontend: require('./frontend.js')
};


module.exports = function(app) {

    app.get('/', routes.frontend.home);
    app.get('/about', routes.frontend.about);


    app.get('/admin', routes.admin.home);
    app.get('/signin', csrfProtection, routes.admin.signin);
    app.post('/signin', csrfProtection, routes.admin.processSignin);

/*    app.get('/post', authorize, post.post);
    app.get('/post/:slug', post.show);



    
    //app.post('/login', admin.authenticate);
    app.get('/logout', admin.logout);
    app.get('/admin', authorize, admin.index);
    app.get('/admin/post', authorize, article.post);
    //app.post('/admin/post/:slug', authorize, article.postArticle);
    */
    

    app.get('/thank-you', function(req, res){
        res.render('thank-you');
    })
}