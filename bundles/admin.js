var Bundler = require("infrastructure-webpack");

module.exports = Bundler.extend("AdminBundler", {
  target: "./admin",
  commonLoaders: true,
});