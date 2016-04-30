var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

gulp.task('watch', ['build'], function () {
    gulp.watch('./public/assets/sass/**/*.sass', ['build']);
    gulp.watch('./public/assets/sass/**/*.scss', ['build']);

    gulp.watch('./public/assets/js/**/*.js', ['build']);
});

gulp.task('sass', function () {
    return gulp.src('./public/assets/sass/spongehome.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('js', function () {
    return gulp.src('./public/assets/js/**/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/assets/js'));
});

gulp.task('build', ['sass', 'js'], function () {
    return gulp.src('./public/assets/css/spongehome.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('default', ['build'], function () {

});
