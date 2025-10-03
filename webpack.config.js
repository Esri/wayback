// require('dotenv').config({ path: './.env' }); 
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const package = require('./package.json');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { DefinePlugin } = require('webpack');

const {
    title,
    author,
    keywords,
    description,
    homepage
} = package;

module.exports = (env, options)=> {

    const devMode = options.mode === 'development' ? true : false;

    process.env.NODE_ENV = options.mode;
    
    /**
     * Load the environment variables from the specified environment file.
     * The environment file name should be specified using `--env envFileName=.env.development` or `--env envFileName=.env.production`.
     * If the environment file name is not specified, the default value will be `.env`.
     */
    const envFileName = env?.envFileName || '.env';

    // Get the path to the environment file
    const envPath = path.resolve(__dirname, envFileName);
    console.log(`Using environment file: ${envPath}`);

    // check if the environment file exists
    if (!fs.existsSync(envPath)) {
        console.error(`Environment file ${envPath} does not exist. Please create it based on .env.template\n`);
        process.exit(1);
    }

    // Load the environment variables
    const envConfig = dotenv.config({ path: envPath }).parsed || {};
    console.log(`Loaded environment variables from ${envPath}\n`);

    // throw an error if the environment variables is an empty object
    if (Object.keys(envConfig).length === 0) {
        console.error(`No environment variables found in the environment file ${envPath}. Please check the file content or create it based on .env.template\n`);
        process.exit(1);
    }

    if(!envConfig.ARCGIS_OAUTH_CLIENT_ID) {
        console.error(
            `Failed to start/build the application:\n` +
            `Please ensure that the environment variable ARCGIS_OAUTH_CLIENT_ID is set in your .env file.\n` + 
            `Please refer to the Prerequisites section in README for more information on how to set up your environment variables.`
        );
        process.exit(1);
    }

    return {
        devServer: {
            server: 'https',
            host: envConfig.WEBPACK_DEV_SERVER_HOSTNAME || 'localhost',
            allowedHosts: "all"
        },
        entry: path.resolve(__dirname, './src/index.tsx'),
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].[contenthash].js',
            chunkFilename: '[name].[contenthash].js',
            publicPath: '',
            assetModuleFilename: `[name][contenthash][ext][query]`
        },
        devtool: devMode ? 'source-map' : false,
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
            alias: {
                '@components': path.resolve(__dirname, 'src/components/'),
                '@constants': path.resolve(__dirname, 'src/constants/'),
                '@contexts': path.resolve(__dirname, 'src/contexts/'),
                '@hooks': path.resolve(__dirname, 'src/hooks/'),
                '@services': path.resolve(__dirname, 'src/services/'),
                '@store': path.resolve(__dirname, 'src/store/'),
                '@styles': path.resolve(__dirname, 'src/style/'),
                '@typings': path.resolve(__dirname, 'src/types/'),
                '@utils': path.resolve(__dirname, 'src/utils/'),
            },
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
                    test: /\.css$/i,
                    use: [
                        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader", 
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader'
                        }
                    ]
                },
                // { 
                //     test: /\.(woff|woff2|ttf|eot)$/,  
                //     loader: "file-loader",
                //     options: {
                //         name: '[name].[contenthash].[ext]',
                //     }
                // },
                {
                    test: /\.(woff|woff2|ttf|eot)$/,
                    type: 'asset/resource',
                },
                // { 
                //     test: /\.(png|jpg|gif|svg)$/,  
                //     loader: "file-loader",
                //     options: {
                //         name: '[name].[contenthash].[ext]',
                //     }
                // },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    type: 'asset/resource',
                },
            ]
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
            new DefinePlugin({
                // define environment variables to be used in the application
                ARCGIS_OAUTH_CLIENT_ID: JSON.stringify(envConfig.ARCGIS_OAUTH_CLIENT_ID),
                ENV_ARCGIS_PORTAL_ROOT_URL: JSON.stringify(envConfig.ARCGIS_PORTAL_ROOT_URL),
                ENV_WAYBACK_CONFIG_FILE_URL: JSON.stringify(envConfig.WAYBACK_CONFIG_FILE_URL),
                ENV_WAYBACK_EXPORT_GP_SERVICE_ROOT_URL: JSON.stringify(envConfig.WAYBACK_EXPORT_GP_SERVICE_ROOT_URL),
                ENV_METROPOLITAN_UPDATES_FEATURE_LAYER_URL: JSON.stringify(envConfig.METROPOLITAN_UPDATES_FEATURE_LAYER_URL),
                ENV_REGIONAL_UPDATES_FEATURE_LAYER_URL: JSON.stringify(envConfig.REGIONAL_UPDATES_FEATURE_LAYER_URL),
                ENV_COMMUNITY_UPDATES_FEATURE_LAYER_URL: JSON.stringify(envConfig.COMMUNITY_UPDATES_FEATURE_LAYER_URL),
                ENV_WORLD_IMAGERY_BASEMAP_URL: JSON.stringify(envConfig.WORLD_IMAGERY_BASEMAP_URL),
            }),
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
                favicon: './public/esri-favicon-light-32.png',
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
                    'og:image': `${homepage}/public/screenshot.jpg`,
                    "last-modified": new Date().getTime().toString(),
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
            // new CleanWebpackPlugin()
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