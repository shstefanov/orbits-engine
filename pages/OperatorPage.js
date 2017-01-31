var Page = require("../lib/http/ApplicationPage");

module.exports = Page.extend("OperatorPage", {

  title: "Infrastructure Operator Panel",

  user_roles: [ "operator" ],

  root: "/panel",
  
  "GET *": [
    "bundles.panel.getAssets | | assets",
    `websocket.panel.getConnection 
      | req.session.id, { string: true, sessionData: {} }
      | ws_connection`
  ],


});