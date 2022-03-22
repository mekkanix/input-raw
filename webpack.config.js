const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// Utils

const rootDir = process.cwd()

// Config

module.exports = (env, opts) => {
  return {
    mode: 'development',
    entry: './index.js',
    output: {
      library: 'inputRaw',
      libraryTarget: 'umd',
      libraryExport: 'default',
      path: path.join(rootDir, '/dist/'),
      // publicPath: '/',
      filename: 'inputRaw.js',
    },
    module: {
      rules: [
        // Pkg-related rules (internal)
        {
          test: /\.js$/i,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-proposal-class-properties'],
              }
            },
          ]
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  indentedSyntax: true,
                  indentWidth: 2,
                  includePaths: [
                    path.join(rootDir, '/src/sass'),
                  ],
                },
              },
            },
          ]
        },
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'inputRaw.css',
      }),
      new RemoveEmptyScriptsPlugin(),
      // new BundleAnalyzerPlugin({
      //   analyzerMode: 'server',
      //   analyzerPort: 9001,
      //   generateStatsFile: true,
      //   openAnalyzer: false,
      // }),
    ],
  }
}
