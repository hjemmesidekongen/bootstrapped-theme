// Configurations
let config = {
    file: {
        compile: require('./src/compile-settings.json')
    }
};

// Load plugins
let gulp = require('gulp'),
    styles = require('gulp-sass'),
    del = require('del'),
    modernizr = require('gulp-modernizr'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps');

// CSS
gulp.task('styles', function() {
    return gulp.src(config.file.compile.styles)
        .pipe(sourcemaps.init())
        .pipe(styles().on('error', swallowError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/stylesheets'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// Javascripts
gulp.task('javascripts', function() {
    return gulp.src(config.file.compile.javascripts)
        .on('error', swallowError)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/javascripts'))
        .pipe(modernizr())
        .pipe(gulp.dest('./dist/javascripts'))
        .pipe(notify({ message: 'Javascripts task complete' }));
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src(config.file.compile.fonts)
        .pipe(gulp.dest('./dist/fonts'));
});

// Images
gulp.task('images', function() {
    return gulp.src('./src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('./dist/images'))
        .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
    return del([
        './dist/stylesheets',
        './dist/javascripts',
        './dist/images',
        './dist/fonts'
    ]);
});

// Output the error to the terminal instead of dying out
function swallowError (error) {

    // If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}

// Default task
gulp.task('default', ['watch']);

// Watch
gulp.task('watch', function() {

    // Watch styles files
    gulp.watch([
        './src/styles/**/*.scss',
        './src/compile-settings.json'
    ], ['styles']);

    // Watch javascript files
    gulp.watch([
        './src/javascripts/**/*.js',
        './src/compile-settings.json'
    ], ['javascripts']);

    // Watch image files
    gulp.watch('./src/images/**/*', ['images']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/ and all .html files - reload on change
    gulp.watch([
        './dist/**/*',
        './**/*.html'
    ]).on('change', livereload.changed);

});

// Build task
gulp.task('build', ['clean'], function() {
    gulp.start('styles', 'javascripts', 'images', 'fonts');
});
