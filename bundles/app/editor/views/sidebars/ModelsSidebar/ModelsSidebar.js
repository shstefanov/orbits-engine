module.exports = require("lib/views/BaseHeaderView.js").extend({
  template: require("./ModelsSidebar.html"),
  style:    require("./ModelsSidebar.less"),

  data: function(){ return { search: "" }; },

  onrender: function(){
    this.set("meshModels", require("editor/resources.js").meshModels);
    this.observe("state.tab", this.selectMeshModel, this);
  },

  selectMeshModel: function(id){
    if(this.get("state.screen") === "models"){
      require("app").set("selectedMeshModel", id || null);
    }
  }
});
