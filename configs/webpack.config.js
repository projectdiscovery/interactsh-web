// Webpack config file for development

const loaders = require('./webpack.loaders');
const plugins = require('./webpack.plugins');

module.exports = {
  entry: [`whatwg-fetch`, `${__dirname}/../src/index_dev.js`],
  module: {
    rules: [
      loaders.JSLoader,
      loaders.HtmlLoader,
      loaders.SVGLoader,
      loaders.ImageLoader,
      loaders.CSSLoader
    ]
  },
  plugins: [plugins.MiniCssExtractPlugin, plugins.HtmlPlugin],
  devServer: {
    historyApiFallback: true
  },
  watchOptions: {
    poll: true,
    ignored: /node_modules/
  }
};
