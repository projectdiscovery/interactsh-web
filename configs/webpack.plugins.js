// Webpack plugins file

const webpack = require('webpack');
const MiniCssExtractPlugins = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

// Mini CSS extract plugin
const MiniCssExtractPlugin = new MiniCssExtractPlugins({
  filename: '[name].bundle.css',
  chunkFilename: '[id].css'
});

// Html plugin
const HtmlPlugin = new HtmlWebPackPlugin({
  template: `${__dirname}/../public/index.html`,
  filename: './index.html',
  favicon: `${__dirname}/../public/fevicon.png`
});

const HotPlugin = new webpack.HotModuleReplacementPlugin();

// Exporting plugins to use in webpack config file.
module.exports = {
  MiniCssExtractPlugin,
  HtmlPlugin,
  HotPlugin
};
