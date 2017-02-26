module.exports = require("BaseSidebarComponent").extend({
  style:    require("./MaterialsSidebar.less"),

  partials: {
    ItemsList:       `
      {{#meshMaterials}}
        <a 
          {{#if selectedMaterial === _id }} class="active" {{/if}}
          href="{{helpers.innerLink('materials/' + _id)}}">{{name}}</a>
      {{/meshGeometries}}`,
    SidebarControls: "<span>SidebarControls partial example/span>",
  },

  onrender: function(){
    this.set("meshMaterials", require("editor/resources.js").meshMaterials);
    this.observe("state.tab", this.selectMeshMaterial, this);
  },

  selectMeshMaterial: function(id){
    if(this.get("state.screen") === "materials"){
      require("app").set("selectedMaterial", id || null);
    }
  },

  createNewMaterial: function(){
    
  },
});
