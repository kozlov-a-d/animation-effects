// http://dev-city.me/2017/08/31/webpack-config-example
const path = require('path');
// const fs = require('fs');
const _ = require('lodash');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pages = require('./twig.config.js');

let templatePages = _.map(pages, function (page) {
    return new HtmlWebpackPlugin({
        filename: page.filename,
        template: page.template
    });
});

const isDevelopment = !process.env.production;

const myPath = {
    dir: 'web',
    dist: 'web/assets/build',
    scripts: {
        target: 'app.js',
        src: './assets/scripts/main.js'
    },
    images: {
        outputPath: '../images/[name].[ext]'  // костыль
    },
    html: {
        outputPath: '../[name].[ext]'  // костыль
    }
}

const config = {
    entry: myPath.scripts.src,
    output: {
        filename: myPath.scripts.target,
        path: path.resolve(__dirname, myPath.dist)
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [
                    // {
                    // loader: "eslint-loader"
                    // },
                    {
                        loader: 'babel-loader',
                        options: { presets: ['env'] }
                    }
                ]
            },
            {
                test: /\.twig$/,
                loader: 'twig-loader'
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        { loader: "css-loader", options: { sourceMap: true, minimize: isDevelopment } },
                        { loader: "postcss-loader", options: { sourceMap: 'inline' } },
                        { loader: "sass-loader", options: { sourceMap: true } }
                    ]
                })
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: myPath.images.outputPath
                    }
                }, {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 80
                        }
                    }
                },
                ],
            }
        ],
    },

    plugins: [
        new webpack.ProvidePlugin({
            _: 'lodash'
        }),
        new ExtractTextPlugin("app.css"),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            server: { baseDir: [myPath.dir] }
        })
    ].concat(templatePages),

    node: {
        fs: "empty" // avoids error messages (twig-loader)
    }

};

if (isDevelopment) {
    // fs.readdirSync(assetsPath)
    //     .map((fileName) => {
    //         if (['.css', '.js'].includes(path.extname(fileName))) {
    //             return fs.unlinkSync(`${assetsPath}/${fileName}`);
    //         }

    //         return '';
    //     });
} else {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}

module.exports = config;