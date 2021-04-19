// Webpack loaders file

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// JS and JSX loader
const JSLoader = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader'
  }
};
// Html loader
const HtmlLoader = {
  test: /\.html$/,
  use: [
    {
      loader: 'html-loader'
    }
  ]
};
// SVG loader
const SVGLoader = {
  test: /\.svg$/,
  use: [
    {
      loader: 'babel-loader'
    },
    {
      loader: 'react-svg-loader',
      options: {
        jsx: true // true outputs JSX tags
      }
    }
  ]
};
// Image loader
const ImageLoader = {
  test: /\.(gif|png|jpe?g)$/i,
  use: [
    'file-loader',
    {
      loader: 'image-webpack-loader',
      options: {
        bypassOnDebug: true, // webpack@1.x
        disable: true // webpack@2.x and newer
      }
    }
  ]
};

// SCSS loader
const SCSSLoader = {
  test: /\.(scss)$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        modules: false,
        modules: {
          localIdentName: '[local]___[hash:base64:5]'
        }
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        config: {
          path: `${__dirname}/postcss.config.js`
        }
      }
    },
    'sass-loader',
    'resolve-url-loader'
  ]
};
// CSS loader
const CSSLoader = {
  test: /\.(css)$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        modules: false
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        config: {
          path: `${__dirname}/postcss.config.js`
        }
      }
    },
    'resolve-url-loader'
  ]
};

// Exporting loaders to use in webpack config file.
module.exports = {
  JSLoader,
  HtmlLoader,
  SVGLoader,
  ImageLoader,
  SCSSLoader,
  CSSLoader
};
