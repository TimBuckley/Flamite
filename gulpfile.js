var gulp = require('gulp'),
    watch = require('gulp-watch'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    runSequence = require('run-sequence');


gulp.task('clean', function() {
  return gulp.src(['./build'], {base: '.', read: false})
    .pipe(clean());
});

gulp.task('vendor', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.min.js'
  ]).pipe(gulp.dest('./build/vendor/'));
});

gulp.task('build', function() {
  return runSequence('clean', ['vendor'], function() {
    return gulp.src([
      './app/**/*',
      './ext/**/*',
      './manifest.json',
      './icons/*'
    ], {base: '.'}).pipe(gulp.dest('./build'));
  });
});

gulp.task('watch', function() {
  gulp.watch([
    './app/**/*',
    './ext/**/*',
    './manifest.json',
    './icons/*'
  ], ['build']);
});