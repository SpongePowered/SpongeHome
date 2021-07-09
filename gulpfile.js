const
    gulp = require('gulp'),
    rename = require('gulp-rename'),

    path = require('path'),
    data = require('gulp-data'),
    nunjucks = require('gulp-nunjucks'),

    sass = require('gulp-sass')(require('sass')),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),

    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css');
    browserSync = require('browser-sync').create();
    template = require('gulp-template');

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
    gulp.src(['./src/html/**/*.html', '!./src/html/include/*.html'])
        .pipe(data(renderData))
        .pipe(nunjucks.compile({
            path: 'src/html'
        }));

function htmlDev() {
    return renderNunjucks(htmlData)
        .pipe(gulp.dest('./dist/dev/'));
}

function htmlProd() {
    return renderNunjucks(htmlDataProduction)
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
        .pipe(gulp.dest('./dist/prod/'));
}

function scssBase() {
    return gulp.src('./src/scss/spongehome.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer()
        ]))
}

function scssDev() {
    return scssBase().pipe(gulp.dest('./dist/dev/assets/css'))
}

function scssProd() {
    return scssBase()
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/prod/assets/css'));
}

function jsBase() {
    return gulp.src('./src/js/*.js')
}

function jsDev() {
    return jsBase()
        .pipe(template({forumsBase: 'https://staging-forums.spongeproject.net'}))
        .pipe(gulp.dest('./dist/dev/assets/js'))
}

function jsProd() {
    return jsBase()
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(template({forumsBase: 'https://forums.spongepowered.org'}))
        .pipe(gulp.dest('./dist/prod/assets/js'));
}

function imgBase() {
    return gulp.src('./public/assets/img/**')
}

function imgDev() {
    return imgBase().pipe(gulp.dest('./dist/dev/assets/img'))
}

function imgProd() {
    return imgBase().pipe(gulp.dest('./dist/prod/assets/img'))
}

function faviconBase() {
    return gulp.src('./public/favicon.ico')
}

function faviconDev() {
    return faviconBase().pipe(gulp.dest('./dist/dev/'))
}

function faviconProd() {
    return faviconBase().pipe(gulp.dest('./dist/prod/'))
}

const staticDev = gulp.series(imgDev, faviconDev);
const staticProd = gulp.series(imgProd, faviconProd);

exports.build = gulp.series(htmlProd, scssProd, jsProd, staticProd);
exports.buildDev = gulp.series(htmlDev, scssDev, jsDev, staticDev);
exports.dev = gulp.series(this.buildDev, function() {
    browserSync.init({
        server: "./dist/dev"
    });

    gulp.watch('./public/**', staticDev, browserSync.reload);
    gulp.watch('./src/scss/**', scssDev, browserSync.reload);
    gulp.watch("./src/js/**").on('change', gulp.series(jsDev, browserSync.reload));
    gulp.watch("./src/html/**").on('change', gulp.series(htmlDev, browserSync.reload));
});

exports.default = this.build;
