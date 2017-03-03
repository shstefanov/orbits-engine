const App = require("App");
//             Config object or folder    | patch
App.configure(   require.context("./config", true), ADMIN_CONFIG);
App.controllers( require.context("./controllers") );

const app = require("app");
app.init({
  App:     App,
  config:  require("config"),
  data:    require("admin.data"),
  routes:  DEFAULT_ROUTES,
},function(err){
  if(err) throw err;
});

