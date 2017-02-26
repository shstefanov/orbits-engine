module.exports = require("BaseSidebarComponent").extend({
  style:    require("./GeometriesSidebar.less"),

  partials: {
    ItemsList:       `
      {{#meshGeometries}}
        <a 
          {{console.log("-->>", selectedGeometry, _id)}}
          {{#if selectedGeometry === _id }} class="active" {{/if}}
          href="{{helpers.innerLink('geometries/' + _id)}}">{{name}}</a>
      {{/meshGeometries}}`,
    SidebarControls: "<span>SidebarControls partial example/span>",
  },
  
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
