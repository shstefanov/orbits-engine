var Page = require("../lib/http/ApplicationPage");

module.exports = Page.extend("GamePage", {

  title: "Infrastructure Engine",

  root: "/game",

  user_roles: [ "player" ],
  
  "GET *": [
    "bundles.game.getAssets | | assets",
    `websocket.game.getConnection 
      | req.session.id, { string: true, sessionData: {} }
      | ws_connection`
  ],

});