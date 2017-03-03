
module.exports = require("BaseGeometryPropertiesComponent").extend({
  template: require("./template.html"),
  data: function(){
    return {
      geometry_parameters: [
        { name: "width",          input_type: "InputNumber", arg: 0, default: 1 },
        { name: "height",         input_type: "InputNumber", arg: 1, default: 1 },
        { name: "depth",          input_type: "InputNumber", arg: 2, default: 1 },
        { name: "widthSegments",  input_type: "InputNumber", arg: 3, default: 1 },
        { name: "heightSegments", input_type: "InputNumber", arg: 4, default: 1 },
        { name: "depthSegments",  input_type: "InputNumber", arg: 5, default: 1 },
      ]
    };
  },

  // onrender: function(){
  //   this.observe("geometry", function(g){
  //     console.log("observe geometry: ", g);
  //   })
  // }
});