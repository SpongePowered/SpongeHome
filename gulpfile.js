const
    gulp = require('gulp'),
    util = require('gulp-util'),
    named = require('vinyl-named'),
    rename = require('gulp-rename'),

    webpack = require('webpack'),
    gulpWebpack = require('webpack-stream'),

    sass = require('gulp-sass'),

    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),

    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css');

gulp.task('scss', () =>
    gulp.src('./src/scss/spongehome.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest('./public/assets/css'))
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/assets/css'))
);

gulp.task('js', ()  =>
    gulp.src('./src/js/static/*.js')
        .pipe(gulp.dest('./public/assets/js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/assets/js'))
);

const runWebpack = (env) =>
    gulp.src(['./src/js/index.js'])
        .pipe(named())
        .pipe(gulpWebpack(require('./webpack.config.js')(env), webpack))
        .pipe(gulp.dest('./public/assets/js'));

gulp.task('webpack-dev', () => runWebpack('development'));
gulp.task('webpack', ['webpack-dev'], () => runWebpack('production'));

gulp.task('build', ['scss', 'js', 'webpack']);
gulp.task('default', ['build']);

gulp.task('watch', ['build'], () =>
    gulp.watch('./src/**', ['build'])
);
