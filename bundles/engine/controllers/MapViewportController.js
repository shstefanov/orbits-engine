var Controller  = require("infrastructure/lib/client/Controller");

module.exports = Controller.extend("MapViewportController", {
  initOrder: 0,
  config: "viewport",
  init: function(options, cb){
    const app = require("app");
    this.container = document.querySelector(this.config.container);
    if(!this.container) return cb("Can't find DOM element " + this.config.container);
    cb();
  }
});