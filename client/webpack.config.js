// 載入轉存 css 檔案的套件
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin')

var config = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        "index": [
            "./src/scripts/index.js",
            "./src/styles/index.scss"
        ]
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader",
                "sass-loader"
            ]
        },{
            test: /\.html$/,
            loader: "raw-loader" // loaders: ['raw-loader']，這個方式也是可以被接受的。
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "./index.css"
        }),
        new HtmlWebpackPlugin({
          template: './src/index.html',
          inject: false
        })
    ],
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      open: true,
      port: 3000
    }
};

module.exports = config;