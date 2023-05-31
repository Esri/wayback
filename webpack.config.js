const path = require('path');
const os = require('os');
const package = require('./package.json');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const computerName = os.hostname();

/**
 * the App ID `WaybackImagery` of this app only works with `arcgis.com` domain, 
 * therefore I need to run the webpack dev server using the host name below `${computerName}.arcgis.com` instead of `localhost`.
 * 
 * You should update `appId` in `./src/app-config.ts` to use your onw App ID.
 */
const hostname = computerName.includes('Esri') 
    ? `${computerName}.arcgis.com` 
    : 'localhost';

const {
    title,
    author,
    keywords,
    description,
    homepage
} = package;

module.exports = (env, options)=> {

    const devMode = options.mode === 'development' ? true : false;

    return {
        devServer: {
            https: true,
            host: hostname,
            allowedHosts: "all"
        },
        entry: path.resolve(__dirname, './src/index.tsx'),
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].[contenthash].js',
            chunkFilename: '[name].[contenthash].js',
            publicPath: '',
        },
        devtool: devMode ? 'source-map' : false,
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.html$/,
                    use: [ 
                        {
                            loader: "html-loader",
                            options: { 
                                minimize: true
                            }
                        }
                    ]
                },
                {
                    test: /\.s?[ac]ss$/,
                    use: [
                        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader", options: {
                                sourceMap: true
                            }
                        }, {
                            loader: "sass-loader", options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                { 
                    test: /\.(woff|woff2|ttf|eot)$/,  
                    loader: "file-loader" 
                },
                // { test: /\.svg$/,  loader: "url-loader?limit=10000&mimetype=image/svg+xml" },
                { 
                    test: /\.svg$/,  
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        fallback: {
                            loader: "file-loader"
                        }
                    }
                },
                // { test: /\.(png|jpg|gif)$/,  loader: "file-loader" },
                {   
                    test: /\.(png|jpg|gif)$/,  
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        fallback: {
                            loader: "file-loader"
                        }
                    }
                },
            ]
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
            // copy static files from public folder to build directory
            new CopyPlugin({
                patterns: [
                    { 
                        from: "public/**/*", 
                        globOptions: {
                            ignore: ["**/index.html"],
                        },
                    }
                ],
            }),
            new HtmlWebPackPlugin({
                // inject: false,
                // hash: true,
                template: './public/index.html',
                filename: 'index.html',
                meta: {
                    title,
                    description,
                    author,
                    keywords: Array.isArray(keywords) 
                        ? package.keywords.join(',') 
                        : undefined,
                    'og:title': title,
                    'og:description': description,
                    'og:url': homepage,
                },
                minify: {
                    html5                          : true,
                    collapseWhitespace             : true,
                    minifyCSS                      : true,
                    minifyJS                       : true,
                    minifyURLs                     : false,
                    removeComments                 : true,
                    removeEmptyAttributes          : true,
                    removeOptionalTags             : true,
                    removeRedundantAttributes      : true,
                    removeScriptTypeAttributes     : true,
                    removeStyleLinkTypeAttributese : true,
                    useShortDoctype                : true
                }
            }),
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: devMode ? '[name].css' : '[name].[contenthash].css',
                chunkFilename: devMode ? '[name].css' : '[name].[contenthash].css',
            }),
            new CleanWebpackPlugin()
        ].filter(Boolean),
        optimization: {
            // splitChunks: {
            //     cacheGroups: {
            //         default: false,
            //         vendors: false,
            //         // vendor chunk
            //         vendor: {
            //             // sync + async chunks
            //             chunks: 'all',
            //             name: 'vendor',
            //             // import file path containing node_modules
            //             test: /node_modules/
            //         }
            //     }
            // },
            minimizer: [
                new TerserPlugin({
                    extractComments: true,
                    terserOptions: {
                        compress: {
                            drop_console: true,
                        }
                    }
                }), 
                new CssMinimizerPlugin()
            ]
        }
    }

};