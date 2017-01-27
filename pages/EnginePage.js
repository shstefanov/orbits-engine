var Page = require("../lib/http/BasePage");

module.exports = Page.extend("EnginePage", {

  title: "Infrastructure Engine",
  
  root: "/engine",
  
  pre:  [
    `@redirectIf | !req.session.logged, 
      res, this.env.config.http_endpoints.not_authorized_redirect, 302`,
    "bundles.engine.getAssets | | assets"
  ],

  "GET *": [
    `websocket.engine.getConnection 
      | req.session.id, { string: true, sessionData: {} }
      | ws_connection`
  ],

  after: "#engine.mustache",

});