var Page = require("infrastructure-express/Page");

module.exports = Page.extend("EnginePage", {

  title: "Voxel Engine",
  
  root: "/engine",
  
  pre:  [
    "bundles.engine.getAssets | | assets"
  ],

  "GET *": [],

  after: "#engine.mustache",




});