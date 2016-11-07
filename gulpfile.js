const
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),

    webpack = require('webpack'),

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

const webpackStatsOptions = {
    colors: gutil.colors.supportsColor,
    hash: false,
    chunks: false
};

const runWebpack = config => {
    const compiler = webpack(config);
    return done => compiler.run((err, stats) => {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log(stats.toString(webpackStatsOptions));
        done()
    })
};

const webpackConfig = require('./webpack.config.js');
gulp.task('webpack-dev', runWebpack(webpackConfig.development));
gulp.task('webpack', ['webpack-dev'], runWebpack(webpackConfig.production));

gulp.task('build', ['scss', 'js', 'webpack']);
gulp.task('default', ['build']);

gulp.task('watch', ['build'], () =>
    gulp.watch('./src/**', ['build'])
);
