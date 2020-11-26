const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const {CleanWebpackPlugin}  = require('clean-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');
const fs = require('fs');

const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
}

const PAGES_DIR = `${PATHS.src}/pug/main`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {

    externals: {
        paths: PATHS
    },

    entry:{
        app: PATHS.src
    },
    output:{
        filename: `js/[name].[hash].js`,
        path: PATHS.dist
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
            vendor: {
                name: 'vendors',
                test: /node_modules/,
                chunks: 'all',
                enforce: true
            }
            }
        }
    },
    plugins:[
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page.replace(/\.pug/,'.html')}`
        })),
        // new HtmlWebpackPlugin({
        //     //template: `${PATHS.src}/index.html`,
        //     //filename: './index.html'
        //     template: `${PAGES_DIR}/${page}`,
        //     filename: `./${page.replace(/\.pug/,'.html')}`
        // }),
        new MiniCssExtractPlugin({
            filename: `[name].[hash].css`
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss:[
                    autoprefixer()
                ]
            }
        }),
        new CopyWebpackPlugin({
            patterns:[
                {from: `${PATHS.src}/img`, to:  `img`},
                //{from: `${PATHS.src}/fonts`, to:  `fonts`},
                {from: `${PATHS.src}/static`, to:  `static`},
            ]
        })

    ],
    module: {
        rules:[
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                options: {
                    pretty: true
                }
            },
            {
                test:/\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: `img/[name].[ext]`

                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: `fonts/[name].[ext]`

                }
            },
            {  
                test:/\.css$/,
                use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '',
                    },
                }, 
                'css-loader',
                'postcss-loader'
                ]
            },
            {  
                test:/\.s[ac]ss$/,
                use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '',
                    },
                }, 
                'css-loader',
                'postcss-loader',
                'sass-loader'
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test:/\.vue$/,
                loader: 'vue-loader',
                options: {
                    loader:{
                        scss: 'vue-style-loader!css-loader!sass-loader'
                    }
                }
            }
            // {
            //     test:/\.s[ac]ss$/,
            //     use: [
            //         'style-loader',
            //         MiniCssExtractPlugin.loader,
            //         {
            //             loader: 'css-loader',
            //             options: {sourceMap: true}
            //         },
            //         {
            //             loader: 'postcss-loader',
            //             options: {
            //                 postcssOptions:{
            //                     plugins:[
            //                         'autoprefixer',
            //                         'cssnano'
            //                     ]
            //                 }
            //             }
            //         },
            //         {
            //             loader: 'sass-loader',
            //             options: {sourceMap: true}
            //         }
            //     ]
            // },
        ]
    }
}