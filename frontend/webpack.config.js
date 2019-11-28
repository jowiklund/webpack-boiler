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
    filename: "[name]-bundle.js",
		path: path.resolve(__dirname, "dist"),
		publicPath: "/"
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
      filename: "styles.css"
		})
  ]
};
