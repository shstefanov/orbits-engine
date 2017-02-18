const ObjectModel = require("lib/models/MeshModels/MeshModel.js");

module.exports = require("lib/views/BaseHeaderView.js").extend({
  template: require("./ModelsSidebar.html"),
  style:    require("./ModelsSidebar.less"),

  data: function(){
    return {
      search: ""
    };
  },

  onrender: function(){
    this.observe("state.tab", this.selectMeshModel, this);
  },

  addObject: function(){
    require("app").set({ currentObjectModel: new ObjectModel() });
  },

  selectMeshModel: function(id){
    require("app").set("selectedMeshModel", id || null);
  }
});
