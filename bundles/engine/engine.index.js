var App = require("App");
App.config(require.context("./config", true));
App.Controllers = App.bulk(require.context("./controllers"));

var app = require("app");

app.init({
  App:          App,
  config:       require("config"),
  settings:     window.settings || {},
  routes:       require("./routes.json"),
  data:         {}
}, function(err){
  if(err) throw err;
  console.log("app initialized");
});
