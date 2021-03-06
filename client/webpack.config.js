/* eslint-disable no-console */
const path = require('path');

const glob = require('glob');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV;
const DIST = './src/public';

const inputFileNames = glob.sync(path.join(__dirname, 'src', 'presentations', '**', 'index.ts'));
const entry = {};
for (let i = 0; i < inputFileNames.length; i++) {
  const inputFileName = inputFileNames[i];
  const outputFileName = inputFileName
    .replace(path.join(__dirname, 'src', 'presentations'), DIST)
    .replace('index.ts', 'bundle');
  entry[outputFileName] = inputFileName;
}

module.exports = (env, argv) => {
  const config = {
    entry,
    output: {
      filename: '[name].js',
      path: __dirname,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: './tsconfig.json',
        }),
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          NODE_ENV: process.env.NODE_ENV,
        }),
      }),
    ],
    optimization: {
      minimize: argv.mode === 'production',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
            },
          },
        },
      ],
    },
  };

  if (NODE_ENV === 'production') {
    console.log(`Building as production...`);
    config.optimization.minimize = true;

    if (process.env.ANALYSIS === 'true') {
      console.log(`Building for analyze...`);
      config.plugins.push(new BundleAnalyzerPlugin());
    }
  } else {
    console.log('Building as development...');
    config.devtool = 'inline-source-map';
  }
  return config;
};
