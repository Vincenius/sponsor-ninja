const path = require('path');
const { DefinePlugin } = require('webpack')
require('dotenv').config({ path: './.env' });

const jsConfig = {
  entry: './src/index.js',
  output: {
    filename: 'widget.js',
    path: path.resolve(__dirname, ''),
    library: 'SponsorNinja',
    libraryTarget: 'var', // commonjs
    libraryExport: 'default',
  },
  plugins: [
    new DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ]
};

const npmConfig = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, ''),
    library: 'SponsorNinja',
    libraryTarget: 'commonjs',
    libraryExport: 'default',
  },
  plugins: [
    new DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ]
};

module.exports = [jsConfig, npmConfig]