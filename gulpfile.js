var gulp   = require('gulp'),
    sass   = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

gulp.task('watch', ['build'], function () {
    gulp.watch('./src/scss/**/*.scss', ['scss']);
    gulp.watch('./src/js/**/*.js',     ['js']);
});

gulp.task('scss', function () {
    return gulp.src('./src/scss/spongehome.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('js', function () {
    return gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/assets/js'));
});

gulp.task('build', ['scss', 'js']);
gulp.task('default', ['build']);
