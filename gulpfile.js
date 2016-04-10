var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename');

gulp.task('watch', ['build'], function () {
    gulp.watch('./assets/css/**/*.sass', ['build']);
});

gulp.task('sass', function () {
    return gulp.src('./assets/css/spongehome.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./assets/css'));
});

gulp.task('build', ['sass'], function () {
    return gulp.src('./assets/css/spongehome.min.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./assets/css'));
});

gulp.task('default', ['build'], function () {

});
