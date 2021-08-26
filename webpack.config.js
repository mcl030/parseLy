const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: [
    // "regenerator-runtime/runtime.js",
    path.join(__dirname, '/client/index.js')],
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', `@babel/preset-react`], 
            plugins: ['react-hot-loader/babel']
          }
        } 
      }, 
      {
        test: /.(css|scss)$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: {
      '/recipe': 'http://localhost:3000',
    },
    compress: true,
    hot: true,
    static: {
      directory: path.join(__dirname, 'build'),
      publicPath: '/'
    }
  }, 
  plugins: [
    new HtmlWebpackPlugin({
      name: 'index.html',
      inject: false,
      template: './client/index.html',
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  }
}