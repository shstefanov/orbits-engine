const Controller  = require("infrastructure/lib/client/Controller");

module.exports = Controller.extend("DataController", {
  initOrder: 1,
  init: function(options, cb){
    const app    = require("app");
    const socket = app.WebsocketController;
    const data   = require("editor/data.js");

    Promise.all([

      // Get MeshModels
      new Promise(function(success, error){
        socket.getMeshModels(null, function(err, result){
          if(err) return error(err);
          data.meshModels.reset(result.models);
          success(true);
        });
      }),

    ]).then(function(){ 
      app.set(data);
      cb();
    }).catch(cb);

  }
});