const View = require("infrastructure-appcontroller-ractive/ractive-backbone-view.js");
const resource_context = require("resources-context");

const base_href = document.querySelector("base").getAttribute("href");

module.exports = View.extend({
  data: function(){
    return {
      config:    require("config"),
      resources: require("resources-context"),

      helpers: {
        toCamelCase: function(str){
          return str ? str.split("-").map((part)=>{
            return part[0].toUpperCase() + part.slice(1);
          }).join("") : "";
        },
        innerLink: function(str){
          return (base_href + "/" + str).replace(/\/\//, "/").replace(/\/$/, "");
        }       
      }

    };
  },


});