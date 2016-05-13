var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

gulp.task('watch', ['build'], function () {
    gulp.watch('./public/assets/scss/**/*.scss', ['build']);

    gulp.watch('./public/assets/js/**/*.js', ['build']);
});

gulp.task('scss', function () {
    return gulp.src('./public/assets/scss/spongehome.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('js', function () {
    gulp.src('./public/assets/js/jquery.truncate.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/assets/js'));

    return gulp.src('./public/assets/js/spongehome.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/assets/js'));
});

gulp.task('build', ['scss', 'js'], function () {
    return gulp.src('./public/assets/css/spongehome.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('default', ['build'], function () {

});
