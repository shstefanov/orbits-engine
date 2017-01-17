const Controller  = require("infrastructure/lib/client/Controller");

module.exports = Controller.extend("DataController", {
  initOrder: 1,
  init: function(options, cb){
    var data = require("data");

    cb();
  }
});