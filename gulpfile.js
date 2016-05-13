/* global require */

var gulp = require('gulp');

var templateCache = require('gulp-angular-templatecache');
var htmlMin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var streamqueue = require('streamqueue');
var jscs = require('gulp-jscs');

gulp.task('minify', function() {
  var stream = streamqueue({objectMode: true});
  stream.queue(gulp.src('./build/**/*.js'));
  stream.queue(
              gulp.src('./src/**/*.html')
                  .pipe(htmlMin({
                    removeEmptyAttributes: true
                  }))
                  .pipe(templateCache({
                    module: 'prodigi.fileupload.templates',
                    root: '/prdgFileUpload/'
                  }))
    );

  stream.done()
        .pipe(concat('prdg-file-upload.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));

});

gulp.task('non-minified-dist', function() {
  var stream = streamqueue({objectMode: true});
  stream.queue(gulp.src('./build/**/*.js'));
  stream.queue(
              gulp.src('./src/**/*.html')
                  .pipe(templateCache({
                    module: 'prodigi.fileupload.templates',
                    root: '/prdgFileUpload/'
                  }))
    );

  stream.done()
        .pipe(concat('prdg-file-upload.js'))
        .pipe(gulp.dest('dist/'));

});

gulp.task('default', [
  'minify',
  'non-minified-dist']);

gulp.task('watch', function() {
  gulp.watch('./build/**/*', ['default']);
  gulp.watch('./src/**/*.html', ['default']);
});
