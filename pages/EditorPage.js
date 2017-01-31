var Page = require("../lib/http/ApplicationPage");

module.exports = Page.extend("EditorPage", {

  title: "Infrastructure Editor Panel",

  user_roles: [ "editor" ],

  root: "/editor",
  
  "GET *": [
    "bundles.editor.getAssets | | assets",
    `websocket.editor.getConnection 
      | req.session.id, { string: true, sessionData: {} }
      | ws_connection`
  ],


});