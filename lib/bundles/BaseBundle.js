
var Bundler = require("infrastructure-webpack");

module.exports = Bundler.extend("BaseBundler", {
  commonLoaders: true,
  aliasify: true,
  aliasSeparator: "/",

  chunks: ["singlepage_interface"],

  loaders: [
    { test: /\.xml$/i, loader: "raw-loader" }
  ],

});