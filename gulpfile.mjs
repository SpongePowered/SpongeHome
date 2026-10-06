import gulp from 'gulp';
import rename from 'gulp-rename';

import path from 'node:path';
import data from 'gulp-data';
import {nunjucksCompile} from 'gulp-nunjucks';

import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';

import htmlmin from 'gulp-html-minifier-terser';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import browserSyncFactory from 'browser-sync';
import template from 'gulp-template';

import sponsors from './sponsors.json' with {type: 'json'};

const sass = gulpSass(dartSass);
const browserSync = browserSyncFactory.create();

// Cache-busting query for local assets: the commit SHA when GIT_SHA is provided, otherwise a build timestamp (YYYYMMDDHHmm)
const version = process.env.GIT_SHA?.slice(0, 7) || new Date().toISOString().replace(/\D/g, '').slice(0, 12);

function htmlData(file) {
    const name = path.basename(file.path, '.html');
    return {
        base: process.env.HTML_BASE || '/',
        page: name,
        menu: {
            [name === 'chat' ? 'chat' : 'index']: 'active'
        },
        sponsors: sponsors,
        version: version
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
        .pipe(nunjucksCompile({}, {
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
    return gulp.src('./public/assets/img/**', {encoding: false})
}

function imgDev() {
    return imgBase().pipe(gulp.dest('./dist/dev/assets/img'))
}

function imgProd() {
    return imgBase().pipe(gulp.dest('./dist/prod/assets/img'))
}

function faviconBase() {
    return gulp.src('./public/favicon.ico', {encoding: false})
}

function faviconDev() {
    return faviconBase().pipe(gulp.dest('./dist/dev/'))
}

function faviconProd() {
    return faviconBase().pipe(gulp.dest('./dist/prod/'))
}

const staticDev = gulp.series(imgDev, faviconDev);
const staticProd = gulp.series(imgProd, faviconProd);

export const build = gulp.series(htmlProd, scssProd, jsProd, staticProd);
export const buildDev = gulp.series(htmlDev, scssDev, jsDev, staticDev);
export const dev = gulp.series(buildDev, function() {
    browserSync.init({
        server: "./dist/dev"
    });

    gulp.watch('./public/**', staticDev, browserSync.reload);
    gulp.watch('./src/scss/**', scssDev, browserSync.reload);
    gulp.watch("./src/js/**").on('change', gulp.series(jsDev, browserSync.reload));
    gulp.watch("./src/html/**").on('change', gulp.series(htmlDev, browserSync.reload));
});

export default build;
