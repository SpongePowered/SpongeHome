var webpack = require('webpack'),
    path = require('path');

module.exports = function (env) {
    var config = {
        devtool: 'eval',

        output: {
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
                }
            ],
        },

        resolve: {
            modules: [
                path.resolve(__dirname, 'src/js'),
                path.resolve(__dirname, 'src/vue'),
            ]
        },

        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"' + env + '"'
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
};
