const App = require("App");
//             Config object or folder    | patch
App.configure(   require.context("./config", true), ADMIN_CONFIG);
App.controllers( require.context("./controllers") );

const app = require("app");
app.init({
  config:  require("config"),
  data:    require("admin.data"),
  routes:  DEFAULT_ROUTES,
},function(err){
  if(err) return console.log(err.stack);
})







// var App = require("App");
// App.config(require.context("./config", true));
// App.Controllers = App.bulk(require.context("./controllers"));
// App.Models      = App.bulk(require.context("./models", true));

// var app = require("app");



// app.init({
//   App:          App,
//   config:       require("config"),
//   settings:     window.settings || {},
//   routes:       require("./routes.json"),
//   data:         {}
// }, function(err){
//   if(err) throw err;
//   console.log("app initialized");
// });
