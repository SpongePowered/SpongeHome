const webpack = require('webpack');

const bubleConfig = {
    transforms: {
        modules: false,
        dangerousForOf: true
    }
};

const baseConfig = {
    entry: {
        index: 'index',
        downloads: 'downloads'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'buble-loader',
                exclude: /node_modules/,
                options: bubleConfig
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/,
                options: {
                    buble: bubleConfig
                }
            }
        ],
    },

    resolve: {
        modules: [
            'node_modules',
            'src/js'
        ]
    },

    externals: {
        vue: 'Vue'
    }
};

function extendConfig(env, config) {
    config = Object.assign(config, baseConfig);

    config.name = env;
    config.plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(env),
            DOWNLOADS_API_URL: JSON.stringify(process.env.DOWNLOADS_API_URL)
        }
    }));

    return config
}

exports.dev = extendConfig('development', {
    devtool: 'eval',

    output: {
        path: __dirname + '/dist/dev/assets/js',
        filename: '[name].js',
        publicPath: '/assets/js'
    },

    plugins: []
});

exports.prod = extendConfig('production', {
    devtool: false,

    output: {
        path: __dirname + '/dist/prod/assets/js',
        filename: '[name].min.js'
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]
});

exports.config = [exports.dev, exports.prod];

// webpack-dev-server config
function createServerConfig() {
    const config = Object.assign({}, exports.dev);

    config.entry = Object.assign({}, config.entry);
    for (const key of Object.keys(config.entry)) {
        config.entry[key] = ['webpack-dev-server/client?http://localhost:8080/', 'webpack/hot/dev-server']
            .concat(config.entry[key])
    }

    config.plugins = config.plugins.concat(new webpack.HotModuleReplacementPlugin());
    return config
}

exports.server = createServerConfig();

exports.serverOptions = {
    contentBase: ['./dist/dev', './public'],
    setup(app) {
        const serveHtml = (name, res) =>
            res.sendFile(`${name}.html`, {root: './dist/dev'}, err => {
                if (err) {
                    // Return not found for missing pages
                    if (err.code === 'ENOENT') {
                        res.sendStatus(404)
                    } else {
                        console.log(err);
                        res.status(err.status).end();
                    }
                }
            });

        app.get('/:page', (req, res) => serveHtml(req.params.page, res));
        app.get('/downloads/*', (req, res) => serveHtml('downloads', res));
    },

    publicPath: '/assets/js',

    hot: true,
    compress: true
};
