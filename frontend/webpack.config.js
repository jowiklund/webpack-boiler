const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const globImporter = require("node-sass-glob-importer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
		main: "./src/index.js"
	},
	mode: "development",
  output: {
		filename: "js/[name].[contenthash].js",
		path: path.resolve(__dirname, "dist"),
		publicPath: "/"
	},
	optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  devServer: {
    contentBase: path.join(__dirname, "/"),
    compress: true,
		port: 8082,
		watchContentBase: true,
    stats: {
      children: false, // Hide children information
      maxModules: 0 // Set the maximum number of modules to be shown
    }
  },
  module: {
    rules: [
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: { minimize: true }
					}
				]
			},
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
						loader: MiniCssExtractPlugin.loader,
						options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          {
            // This loader resolves url() and @imports inside CSS
            loader: "css-loader"
          },
          {
            // First we transform SASS to standard CSS
            loader: "sass-loader",
            options: {
							implementation: require("sass"),
							sassOptions: {
								importer: globImporter()
							}
            }
          }
        ]
      }
    ]
  },
  plugins: [
		new HtmlWebpackPlugin({
			template: '../index.html',
			filename: './index.html'
		}),
    new MiniCssExtractPlugin({
      filename: "css/styles.css"
		})
  ]
};
