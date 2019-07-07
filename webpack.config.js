const path = require('path')

module.exports = (env, args) => {
  const PROD = (args.mode == "production")

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: PROD ? 'identishapes.min.js' : 'identishapes.js',
      library: 'identishapes',
      libraryTarget: 'var'
    },

    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env'] }
          }
        }
      ]
    }
  }
}
