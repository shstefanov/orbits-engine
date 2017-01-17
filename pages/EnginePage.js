var Page = require("../lib/http/BasePage");

module.exports = Page.extend("EnginePage", {

  title: "Voxel Engine",
  
  root: "/engine",
  
  pre:  [
    "bundles.engine.getAssets | | assets"
  ],

  "GET *": [
    "websocket.engine.getConnection | req.session.id, { string: true, sessionData: {} } | ws_connection"
  ],

  after: "#engine.mustache",




});