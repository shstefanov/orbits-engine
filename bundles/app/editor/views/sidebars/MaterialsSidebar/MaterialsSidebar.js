module.exports = require("lib/views/BaseHeaderView.js").extend({
  template: require("./MaterialsSidebar.html"),
  style:    require("./MaterialsSidebar.less"),

  data: function(){ return { search: "" }; },

  onrender: function(){
    this.set("meshMaterials", require("editor/resources.js").meshMaterials);
    this.observe("state.tab", this.selectMeshMaterial, this);
  },

  selectMeshMaterial: function(id){
    require("app").set("selectedMaterial", id || null);
  }
});
