const App = require("App");

function parse(name, context, cb){ cb(name.split("/").shift()); }

module.exports = require("BaseSidebarComponent").extend({

  style:    require("./GeometriesSidebar.less"),

  components: App.bulk( require.context("./GeometrySettingsComponets", true, /\.\/[^/]+\/[^\/]+\.js$/), parse ),

  partials: {
    ItemsList:       require("./ItemsList.html"),
    SidebarControls: require("./SidebarControls.html"),
    ItemOptions:     require("./ItemOptions.html"),
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
