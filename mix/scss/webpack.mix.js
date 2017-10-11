const { mix } = require('laravel-mix');

mix.browserSync('my-domain.dev');

mix.extract([
        'modernizr',
        'jquery',
        'bootstrap-sass',
        'lodash',
        'axios'
    ])
    .autoload({
        jquery: ['$', 'window.jQuery', "jQuery", "window.$", "jquery", "window.jquery"],
    })
    .js('src/javascripts/app.js', 'dist/javascripts')
    .sass('src/styles/stylesheet.scss', 'dist/stylesheets');

mix.copy('src/images', 'dist/images');