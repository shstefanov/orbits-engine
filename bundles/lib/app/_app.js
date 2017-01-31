// Named _app because of Microsoft Windows - there is App.js in this directory

var App = require("App");
module.exports = new App.Controllers.AppController();
var config = require("config");
if(config.debug === true) {
  window.app    = module.exports;
}