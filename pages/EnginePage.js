var Page = require("../lib/http/BasePage");

module.exports = Page.extend("EnginePage", {

  title: "Voxel Engine",
  
  root: "/engine",
  
  pre:  [
    // "@redirectIf | !req.session.logged, res, '/auth/login', 302",
    "bundles.engine.getAssets | | assets"
  ],

  "GET *": [
    "websocket.engine.getConnection | req.session.id, { string: true, sessionData: {} } | ws_connection"
  ],

  after: "#engine.mustache",




});