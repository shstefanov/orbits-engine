const Controller  = require("infrastructure/lib/client/Controller");

module.exports = Controller.extend("DataController", {
  initOrder: 1,
  init: function(options, cb){
    
    const app    = require("app");
    const socket = app.WebsocketController;
    const data   = require("game.data");
    cb();

    socket.getBlocks(null, function(err, result){
      if(err) return console.error(err);
      console.log("blocks comming");
      data.blocks.reset(result.blocks);
    });

  }
});