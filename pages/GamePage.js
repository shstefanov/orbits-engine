var Page = require("../lib/http/ApplicationPage");

module.exports = Page.extend("EnginePage", {

  title: "Infrastructure Engine",
  
  root: "/game",
  
  "GET *": [
    "bundles.game.getAssets | | assets",
    `websocket.game.getConnection 
      | req.session.id, { string: true, sessionData: {} }
      | ws_connection`
  ],

});