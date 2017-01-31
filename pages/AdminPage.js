var Page = require("../lib/http/ApplicationPage");

module.exports = Page.extend("AdminPage", {

  title: "Infrastructure Engine Admin Page",

  user_roles: [ "admin" ],

  root: "/admin",
  
  "GET *": [
    "bundles.admin.getAssets | | assets",
    `websocket.admin.getConnection 
      | req.session.id, { string: true, sessionData: {} }
      | ws_connection`
  ],


});