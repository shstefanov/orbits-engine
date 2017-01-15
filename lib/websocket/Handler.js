var _ = require("underscore");
var WebsocketHandler = require("infrastructure-socketio/WebsocketHandler");
 
module.exports = WebsocketHandler.extend("EngineWebsocketHandler", {

  // disconnectSocket: function(socket){
  //   console.log( "disconnect", socket.id );
  // },

  debug: function(name, data, cb){
    console.log(name, data);
    cb(null, true);
  },

});