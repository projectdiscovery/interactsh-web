// Webpack config file for production build

const loaders = require('./webpack.loaders');
const plugins = require('./webpack.plugins');

module.exports = {
  entry: {
    app: ['@babel/polyfill', `whatwg-fetch`, `${__dirname}/../src/index.js`]
  },

  module: {
    rules: [
      loaders.JSLoader,
      loaders.HtmlLoader,
      loaders.SVGLoader,
      loaders.ImageLoader,
      loaders.SCSSLoader,
      loaders.CSSLoader
    ]
  },
  plugins: [plugins.MiniCssExtractPlugin, plugins.HtmlPlugin],
  output: {
    filename: '[name].js',
    path: `${__dirname}/../dist/prod`
  }
};
