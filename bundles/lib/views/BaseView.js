var View = require("infrastructure-appcontroller-ractive/ractive-backbone-view.js");
var resource_context = require("resources-context");
module.exports = View.extend({
  data: function(){
    return {
      config:    require("config"),
      resources: require("resources-context"),

      helpers: {
        toCamelCase: function(str){
          return str.split("-").map((part)=>{
            return part[0].toUpperCase() + part.slice(1);
          }).join("");
        }        
      }

    };
  },


});