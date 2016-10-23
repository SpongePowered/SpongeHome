var gulp = require('gulp'),
    util = require('gulp-util'),
    named = require('vinyl-named'),
    rename = require('gulp-rename'),

    webpack = require('webpack'),
    gulpWebpack = require('webpack-stream'),

    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css');

gulp.task('scss', function () {
    return gulp.src('./src/scss/spongehome.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/assets/css'))
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/assets/css'))
});

gulp.task('js', function () {
    return gulp.src('./src/js/static/*.js')
        .pipe(gulp.dest('./public/assets/js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/assets/js'))
});

function runWebpack(env) {
    return gulp.src([])
        .pipe(named())
        .pipe(gulpWebpack(require('./webpack.config.js')(env), webpack))
        .pipe(gulp.dest('./public/assets/js'))
}

gulp.task('webpack-dev', function() {
    return runWebpack('development')
});

gulp.task('webpack', ['webpack-dev'], function() {
    return runWebpack('production')
});

gulp.task('build', ['scss', 'js', 'webpack']);
gulp.task('default', ['build']);

gulp.task('watch', ['build'], function () {
    gulp.watch('./src/**', ['build']);
});
