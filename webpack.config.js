var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/js/main.js',
    output: {
        path: __dirname,
        filename: './bin/bundle.js'
    },
    module: {
        loaders: [{
            loader: 'babel-loader',
            test: path.join(__dirname, 'es2015'),
            query: {
                presets: 'es2015'
            },
        }]
    },
    plugins: [
        // Avoid publishing files when compilation fails
        new webpack.NoErrorsPlugin()
    ],
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
};