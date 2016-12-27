var webpack = require('webpack');
var path = require('path');

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

//这个插件使得一个模块作为每个模块中的变量。 仅当使用变量时，才需要该模块。
//示例：在不编写require（“jquery”）的情况下，在每个模块中使用$和jQuery。
var providePlugin = new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
});

module.exports = {
    entry: {
        home: './public/src/js/home.js',
        //vendor: ['jquery']
    },
    output: {
        filename: '[name].js'
    },
/*    externals: {
        'jquery': 'jQuery'
    },*/
    module:{
/*        loaders:[
            { test: /\.html$/, loader: 'underscore-template-loader' }
        ]*/
    },
    resolve: {
/*        alias: {
            jquery: path.resolve(__dirname, 'public/vendor/jquery.min.js')
        }*/
    },
    plugins: [commonsPlugin, providePlugin]
};
