const path = require('path');
const { DefinePlugin } = require('webpack')
require('dotenv').config({ path: './.env' });

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'widget.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ]
};