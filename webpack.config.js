const path = require("path");
const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// defines where the bundle file will live
const bundlePath = path.resolve(__dirname, "dist/");

module.exports = (_env, argv) => {
  let entryPoints = {
    VideoComponent: {
      path: "./src/views/VideoComponentPage/index.tsx",
      outputHtml: "video_component.html",
      build: true,
      title: "QuickStartGG Component",
    },
    Config: {
      path: "./src/views/ConfigPage/index.tsx",
      outputHtml: "config.html",
      build: true,
      title: "QuickStartGG Config",
    },
    LiveConfig: {
      path: "./src/views/LiveConfigPage/index.tsx",
      outputHtml: "live_config.html",
      build: true,
      title: "QuickStartGG Live Config",
    },
  };

  let entry = {};

  // Default plugins
  let plugins = [new CleanWebpackPlugin()];

  for (const name in entryPoints) {
    if (entryPoints[name].build) {
      entry[name] = entryPoints[name].path;

      // Prod-specific configs
      plugins.push(
        new HtmlWebpackPlugin({
          inject: true,
          chunks: [name],
          template: "./template.html",
          filename: entryPoints[name].outputHtml,
          title: entryPoints[name].title,
        }),
      );

      // Dev-specific configs
      if (argv.mode === "development") {
        plugins.push(new webpack.HotModuleReplacementPlugin());
      }
    }
  }

  let config = {
    //entry points for webpack- remove if not used/needed
    entry,
    optimization: {
      minimize: true, // this setting is default to false to pass review more easily. you can opt to set this to true to compress the bundles, but also expect an email from the review team to get the full source otherwise.
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: "file-loader",
          options: {
            name: "img/[name].[ext]",
          },
        },
      ],
    },
    resolve: {
      alias: {
        "@services": path.resolve(__dirname, "src/services"),
      },
      extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
    },
    output: {
      filename: "[name].bundle.js",
      path: bundlePath,
    },
    performance: {
      maxEntrypointSize: 512000,
    },
    plugins,
  };

  if (argv.mode === "development") {
    config.devServer = {
      static: path.join(__dirname, "public"),
      host: argv.devrig ? "localhost.rig.twitch.tv" : "localhost",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      port: 8080,
    };
    config.devServer.https = true;
  }

  if (argv.mode === "production") {
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          chunks: "all",
          test: /node_modules/,
          name: false,
        },
      },
      name: false,
    };
  }

  return config;
};
