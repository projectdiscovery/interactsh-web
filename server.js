const express = require('express');
const path = require('path');

const portDev = process.env.PORT || 8090;
const portProd = process.env.PORT || 8091;
const expressDev = express();
const expressProd = express();

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('./configs/webpack.build.dev');
  const compiler = webpack(config);

  expressDev.use(webpackDevMiddleware(compiler));
  expressDev.use(webpackHotMiddleware(compiler));
}

// serve static assets normally
expressDev.use(express.static(`${__dirname}/dist/dev`));
expressProd.use(express.static(`${__dirname}/dist/prod`));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
expressDev.get('/*', function(request, response) {
  response.sendFile(path.resolve(__dirname, 'dist/dev', 'index.html'));
});
expressProd.get('/*', function(request, response) {
  response.sendFile(path.resolve(__dirname, 'dist/prod', 'index.html'));
});

expressDev.listen(portDev);
expressProd.listen(portProd);
