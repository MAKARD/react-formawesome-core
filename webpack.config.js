// tslint:disable
const path = require("path");
const webpack = require("webpack");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

const debug = process.env.NODE_ENV !== "production";

console.log("Debug: " + debug.toString());

const config = {
    entry: ["./src/index.ts"],
    target: "node",
    externals: [nodeExternals()],

    output: {
        filename: "index.js",
        path: path.resolve("./build"),
        publicPath: "/",
        library: "react-formawesome-core",
        libraryTarget: "umd"
    },

    devtool: debug ? "source-map" : false,

    resolve: {
        extensions: [".ts", ".js", ".json", ".jsx", ".tsx",],
        modules: [
            path.resolve("node_modules"),
            path.resolve("src")
        ]
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: [
                    {
                        loader: "babel-loader",
                        query: {
                            presets: [
                                "react",
                                ["env", {
                                    "targets": {
                                        "browsers": ["last 2 versions", "safari >= 10", "ie >= 11"]
                                    }
                                }]
                            ],
                            "plugins": ["transform-object-rest-spread"]
                        }
                    },
                    "awesome-typescript-loader"
                ]
            },
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                loader: "babel-loader",
                query: {
                    presets: [
                        'react',
                        ['env', {
                            "targets": {
                                "browsers": ["last 2 versions", "safari >= 10", "ie >= 11"]
                            }
                        }]
                    ],
                    "plugins": ["transform-object-rest-spread"]
                }
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
        new CleanWebpackPlugin(path.resolve("./build")),
        new webpack.optimize.ModuleConcatenationPlugin(),
    ]
};

module.exports = config;
