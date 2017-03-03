
module.exports = require("lib/views/BaseView.js").extend({

  components: {
    InputNumber: require("lib/views/BaseView.js").extend({
      template: `
        <input type="number" 
          {{#if typeof options.min == "number"}} min="[[options.min]]"{{/if}}
          {{#if typeof options.max == "number"}} min="[[options.max]]"{{/if}}
          value="{{geometry.geometry_options[options.arg]}}"
        />
      `
    })
  },

  onrender: function(){
    const geometry = this.get("geometry");
    this.observe("geometry.geometry_options", function(value){
      geometry.trigger("change");
    }, this);
  }

});
