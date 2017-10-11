// Configurations
let config = {
  settings: require('./src/compile-settings.json')
};

// Load plugins
let gulp = require('gulp'),
    styles = require('gulp-sass'),
    del = require('del'),
    modernizr = require('gulp-modernizr'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    sourcemaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence');

// Modernizr
gulp.task('modernizr', ['styles', 'javascripts'], function () {
  return gulp.src(['./dist/stylesheets/**/*.css', './dist/javascripts/**/*.js'])
      .pipe(modernizr({
        'cache': true,
        'uglify': true,
        'options': [
          'setClasses',
          'addTest',
          'html5printshiv',
          'testProp',
          'fnBind'
        ],
        excludeTests: [
          'hidden'
        ]
      }))
      .pipe(gulp.dest('./dist/javascripts'));
});

// CSS
gulp.task('styles', function () {
  return gulp.src(config.settings.styles)
      .pipe(sourcemaps.init())
      .pipe(styles().on('error', swallowError))
      .pipe(autoprefixer('last 2 version'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/stylesheets'))
      .pipe(browserSync.stream({ match: '**/*.css' }));
});

// Javascripts
gulp.task('javascripts', function () {
  return gulp.src(config.settings.javascripts)
      .on('error', swallowError)
      .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/javascripts'))
      .pipe(browserSync.stream({ match: '**/*.js' }));
});

// Fonts
gulp.task('fonts', function () {
  return gulp.src(config.settings.fonts)
      .pipe(gulp.dest('./dist/fonts'));
});

// Images
gulp.task('images', function () {
  return gulp.src('./src/images/**/*')
      .pipe(cache(imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
      })))
      .pipe(gulp.dest('./dist/images'));
});

// Clean
gulp.task('clean', function () {
  return del([
    './dist/stylesheets',
    './dist/javascripts',
    './dist/images',
    './dist/fonts'
  ]);
});

// Output the error to the terminal instead of dying out
function swallowError(error) {

  // If you want details of the error in the console
  console.log(error.toString());

  this.emit('end');
}

// Default task
gulp.task('default', ['watch']);

// Watch
gulp.task('watch', ['build'], function () {

  // Browser sync
  browserSync.init(['./dist/stylesheets/*.css', './dist/javascripts/*.js'], {
    proxy: config.settings.options.proxy
  });

  // Watch styles files
  gulp.watch('./src/styles/**/*.scss', ['styles']);

  // Watch javascript files
  gulp.watch('./src/javascripts/**/*.js', ['javascripts']);

  // Watch image files
  gulp.watch('./src/images/**/*', ['images']);

  // Watch any template files
  gulp.watch(['./**/*.twig', './**/*.tpl.php', './**/*.html']).on('change', browserSync.reload);
});

// Build task
gulp.task('build', function () {
  runSequence('clean', 'modernizr', 'images', 'fonts');
});