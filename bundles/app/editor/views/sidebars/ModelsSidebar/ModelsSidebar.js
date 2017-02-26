module.exports = require("BaseSidebarComponent").extend({
  style:    require("./ModelsSidebar.less"),

  partials: {
    ItemsList: `
      {{#meshModels}}
        <a 
          {{#if selectedMeshModel === _id }} class="active" {{/if}}
          href="{{helpers.innerLink('models/' + _id)}}">{{name}}</a>
      {{/meshModels}}`,
    SidebarControls: "<span>SidebarControls partial example/span>",
  },

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
