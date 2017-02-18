module.exports = require("lib/views/BaseHeaderView.js").extend({
  template: require("./GeometriesSidebar.html"),
  style:    require("./GeometriesSidebar.less"),

  data: function(){ return { search: "" }; },

  onrender: function(){
    this.set("meshGeometries", require("editor/resources.js").meshGeometries);
    this.observe("state.tab", this.selectMeshMaterial, this);
  },

  selectMeshMaterial: function(id){
    if(this.get("state.screen") === "geometries"){
      require("app").set("selectedGeometry", id || null);
    }
  }
});
