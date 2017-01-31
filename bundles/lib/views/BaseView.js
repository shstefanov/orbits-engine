var View = require("infrastructure-appcontroller-ractive/ractive-backbone-view.js");
var resource_context = require("resources-context");
module.exports = View.extend({
  data: function(){
    return {
      config:    require("config"),
      resources: require("resources-context"),
    };
  }
})