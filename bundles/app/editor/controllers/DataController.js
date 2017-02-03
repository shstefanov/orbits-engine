const Controller  = require("infrastructure/lib/client/Controller");

module.exports = Controller.extend("DataController", {
  initOrder: 1,
  init: function(options, cb){
    const app    = require("app");
    const socket = app.WebsocketController;
    const data   = require("editor.data");
    cb();
  }
});