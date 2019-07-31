const
    gulp = require('gulp'),
    rename = require('gulp-rename'),

    path = require('path'),
    data = require('gulp-data'),
    nunjucks = require('gulp-nunjucks'),

    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),

    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css');

const sponsors = require('./sponsors.json');

function htmlData(file) {
    const name = path.basename(file.path, '.html');
    return {
        base: process.env.HTML_BASE || '/',
        page: name,
        menu: {
            [name === 'chat' ? 'chat' : 'index']: 'active'
        },
        sponsors: sponsors
    };
}

function htmlDataProduction(file) {
    const data = htmlData(file);
    data.min = ".min";
    return data;
}

const renderNunjucks = renderData =>
    gulp.src('./src/html/*.html')
        .pipe(data(renderData))
        .pipe(nunjucks.compile({
            path: 'src/html'
        }));

function htmlDev(cb) {
    renderNunjucks(htmlData)
        .pipe(gulp.dest('./dist/dev'));

    cb();
}

function html(cb) {
    renderNunjucks(htmlDataProduction)
        .pipe(htmlmin({
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeComments: true,
            minifyJS: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            sortAttributes: true,
            sortClassName: true,
            useShortDoctype: true
        }))
        .pipe(gulp.dest('./dist/prod'));

    cb();
}

function scss(cb) {
    gulp.src('./src/scss/spongehome.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest('./dist/dev/assets/css'))
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/prod/assets/css'));

    cb();
}

function js(cb) {
    gulp.src('./src/js/*.js')
        .pipe(gulp.dest('./dist/dev/assets/js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/prod/assets/js'));

    cb();
}

function watch() {
    gulp.watch('./src/html/**', gulp.series(htmlDev,  html));
    gulp.watch('./src/scss/**', scss);
    gulp.watch('./src/js/**', js);
}

exports.build = gulp.series(htmlDev, html, scss, js);
exports.watch = watch;
exports.default = this.build;
