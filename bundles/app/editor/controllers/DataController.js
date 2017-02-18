const Controller  = require("infrastructure/lib/client/Controller");

module.exports = Controller.extend("DataController", {
  initOrder: 1,
  init: function(options, cb){
    const app       = require("app");
    const socket    = app.WebsocketController;
    const data      = require("editor/data.js");
    const resources = require("editor/resources.js");

    Promise.all([

      // Get MeshModels
      new Promise(function(success, error){
        socket.getMeshModels(null, function(err, result){
          if(err) return error(err);
          resources.meshModels.reset(result.models);
          success(true);
        });
      }),

    ]).then(function(){
      data.is_loaded = true;
      app.set(data);
      app.trigger("data_loaded");
      cb();
    }).catch(cb);

  }
});