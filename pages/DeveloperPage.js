var Page = require("../lib/http/ApplicationPage");

module.exports = Page.extend("DeveloperPage", {

  title: "Infrastructure Developer Panel",

  user_roles: [ "developer" ],

  root: "/dev",
  
  "GET *": [
    "bundles.dev.getAssets | | assets",
    `websocket.dev.getConnection 
      | req.session.id, { string: true, sessionData: {} }
      | ws_connection`
  ],


});