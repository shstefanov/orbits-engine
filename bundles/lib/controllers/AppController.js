var _ = require("underscore");

module.exports = require("infrastructure-appcontroller-ractive").extend("BaseAppController", {
  // Layout: require("admin/views/Layout.js"),
  config: "app",
  /*
  Resolved config can contain the following working options:
  container: String // selector, where the app will initialize it's Layout view
  pushState: Boolean



  */

  routes: {
    "setContext": "setContext",
  },

  contextParams: ROUTE_STATE_PARAMS,

  setContext: function( screen_name, tab, context, action ){
    this.set( STATE_VAR, _.chain(this.contextParams).zip(arguments).object().value() );
  },

  displayError: function(err, xhr){
    console.error(err);
  }

});
