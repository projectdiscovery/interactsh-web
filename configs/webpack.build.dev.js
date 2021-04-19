// Webpack config file for development build

const loaders = require('./webpack.loaders');
const plugins = require('./webpack.plugins');

module.exports = {
  mode: 'development',
  entry: {
    app: [
      `webpack-hot-middleware/client`,
      `@babel/polyfill`,
      `whatwg-fetch`,
      `${__dirname}/../src/index.js`
    ]
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
  plugins: [plugins.MiniCssExtractPlugin, plugins.HtmlPlugin, plugins.HotPlugin],
  output: {
    filename: '[name].js',
    path: `${__dirname}/../dist/dev`
  }
};
