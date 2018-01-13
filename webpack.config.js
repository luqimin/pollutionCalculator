const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const browsers = [
    'chrome >= 58',
];
let manifestList = './env/core.dev.json';
if (process.env.NODE_ENV === 'production') {
    manifestList = './env/core.prod.json';
}
module.exports = {
    entry: {
        main: './src/index.jsx',
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js'
    },
    watch: true,
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
                cacheDirectory: true,
                presets: [
                    ['env', {
                        useBuiltIns: 'usage',
                        targets: {
                            browsers,
                        },
                    }],
                ],
            },
        }, {
            test: /\.jsx$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
                cacheDirectory: true,
                presets: ['env', 'react'],
                plugins: [
                    "transform-class-properties",
                    ["import", {
                        "libraryName": "antd",
                        "libraryDirectory": "es",
                        "style": "css"
                    }],
                ],
            },
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            }),
        }],
    },
    plugins: [
        new webpack.DllReferencePlugin({
            manifest: require(manifestList),
        }),
        new ExtractTextPlugin({
            allChunks: true,
            filename: 'style.css',
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.css'],
    },
};