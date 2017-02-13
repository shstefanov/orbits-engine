const ObjectModel = require("lib/models/ObjectModels/ObjectModel.js");

module.exports = require("lib/views/BaseHeaderView.js").extend({
  template: require("./ObjectsSidebar.html"),
  style:    require("./ObjectsSidebar.less"),

  data: function(){
    return {
      search: ""
    };
  },

  addObject: function(){
    require("app").set({ currentObjectModel: new ObjectModel() });
  }
});
