/**
 * react webpack dll 配置
 * 这个只打包react及一些polyfill
 */
const path = require('path');
const webpack = require('webpack');

const vendorEntry = {
    core: ['react', 'react-dom'],
};

let manifestPath = './env/[name].dev.json',
    vendorFilename = '[name].js';
if (process.env.NODE_ENV === 'production') {
    manifestPath = './env/[name].prod.json';
    vendorFilename = '[name].min.js';
}

let plugins = [
    new webpack.DllPlugin({
        path: manifestPath,
        name: '[name]',
    }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
    })
];

if (process.env.NODE_ENV === 'production') {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        output: {
            comments: false,
        },
        compress: {
            warnings: false
        }
    }));
}

module.exports = {
    entry: vendorEntry,
    output: {
        path: path.resolve(__dirname, './public'),
        filename: vendorFilename,
        library: '[name]',
    },
    plugins: plugins,
};