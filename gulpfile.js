const
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),

    path = require('path'),
    data = require('gulp-data'),
    nunjucks = require('gulp-nunjucks'),

    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),

    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),

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
            [name]: 'active'
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

gulp.task('html:dev', () =>
    renderNunjucks(htmlData)
        .pipe(gulp.dest('./dist/dev'))
);

gulp.task('html', () =>
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
        .pipe(gulp.dest('./dist/prod'))
);

gulp.task('scss', () =>
    gulp.src('./src/scss/spongehome.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest('./dist/dev/assets/css'))
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/prod/assets/css'))
);

gulp.task('js', ()  =>
    gulp.src('./src/js/static/*.js')
        .pipe(gulp.dest('./dist/dev/assets/js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/prod/assets/js'))
);

const webpackStatsOptions = {
    colors: gutil.colors.supportsColor,
    hash: false,
    chunks: false
};

const webpackConfig = require('./webpack.config.js');

const webpackCompiler = webpack(webpackConfig.config);
gulp.task('webpack', done => webpackCompiler.run((err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log(stats.toString(webpackStatsOptions));
    done()
}));

let server;
gulp.task('dev', ['watch:assets'], done => {
    webpackConfig.serverOptions.stats = webpackStatsOptions;
    const compiler = webpack(webpackConfig.server);
    server = new WebpackDevServer(compiler, webpackConfig.serverOptions);
    server.listen(8080, 'localhost', err => {
        if (err) throw new gutil.PluginError('webpack-dev-server', err);

        const url = "http://localhost:8080"; // TODO: Make port configurable

        gutil.log(`Started server on ${url}`);
        done();
    })
});

gulp.task('build', ['html:dev', 'html', 'scss', 'js', 'webpack']);
gulp.task('default', ['build']);

function reload(done) {
    server && server.sockWrite(server.sockets, 'content-changed');
    done()
}

gulp.task('reload:html', ['html:dev', 'html'], reload);
gulp.task('reload:scss', ['scss'], reload);
gulp.task('reload:js', ['js'], reload);

gulp.task('watch:assets', ['build'], () => {
    gulp.watch('./src/html/**', ['reload:html']);
    gulp.watch('./src/scss/**', ['reload:scss']);
    gulp.watch('./src/js/static/**', ['reload:js']);
});

gulp.task('watch', ['watch:assets'], () =>
    gulp.watch('./src/js/**', ['webpack'])
);
