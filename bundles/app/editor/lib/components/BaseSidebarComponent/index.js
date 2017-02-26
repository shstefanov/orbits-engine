
module.exports = require("lib/views/BaseView.js").extend({

  template: require("./template.html"),

  style: require("editor/lib/styles/CommonSidebarStyles.less"),
  
  data: function(){ 
    // Needed by serach field partial
    return { search: "" }; 
  },

  partials: {
    ItemsList:       "<span>ItemsList partial not implemented</span>",
    SidebarControls: "<span>SidebarControls partial not implemented</span>",
  }

});
