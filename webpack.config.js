var path = require('path');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var packageInfo = require('./package.json');

module.exports = {
  context: __dirname,
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  entry: {
    mozaik: './src/browser'
  },
  noParse: [
    /.*latest\.json$/
  ],
  resolve: {
    extensions: ["", '.json', ".webpack.js", ".web.js", ".js"]
  },
  plugins: [
    new ExtractTextPlugin('mozaik.css', { allChunks: true }),
    new HtmlWebpackPlugin({
      version: packageInfo.version,
      template: 'src/templates/index.html'
    })
  ],
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      { test: /\.jsx?$/, exclude: /(node_modules|bower_components)/,
        loader: 'babel', query: { presets: ['react', 'es2015'] }
      },
      { test: /\.jsx?$/, include: /mozaik-ext-\w+/, loader: 'babel', query: { presets: ['react', 'es2015'] }},
      { test: /\.html$/, loader: 'raw' },
      { test: /\.styl$/, loaders: ['style', 'css', 'postcss', 'stylus' ]},
      { test: /\.css$/, loaders: ['style', 'css', 'postcss' ]},
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.(jpe?g|png|gif|svg)$/i, loaders: [
       'file?hash=sha512&digest=hex&name=[hash].[ext]',
       'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
      ]},
      { test: /\.(ttf|eot|svg)/, loader: 'file' }
    ]
  },
  postcss: function () {
    return [autoprefixer, precss];
  }
};
