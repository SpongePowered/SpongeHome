const webpack = require('webpack');

function createConfig(env) {
    var config = {
        devtool: 'eval',

        entry: {
            index: 'index'
        },

        output: {
            path: __dirname + '/public/assets/js',
            filename: '[name].js'
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel',
                    exclude: /node_modules/
                },
                {
                    test: /\.vue$/,
                    loader: 'vue',
                    exclude: /node_modules/
                }
            ],
        },

        resolve: {
            modules: [
                'src/js',
                'src/vue'
            ]
        },

        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(env),
                }
            })
        ]
    };

    if (env === 'production') {
        config.devtool = false;
        config.output.filename = '[name].min.js';
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.LoaderOptionsPlugin({
                minimize: true
            })
        )
    }

    return config
}

exports.development = createConfig('development');
exports.production = createConfig('production');
