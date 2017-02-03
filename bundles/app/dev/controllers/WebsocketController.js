var Controller = require("infrastructure-socketio/client");
module.exports = Controller.extend("Websocket", {
  initOrder: 0,
  config: window.ws_connection
});