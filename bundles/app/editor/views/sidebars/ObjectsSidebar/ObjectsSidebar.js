module.exports = require("lib/views/BaseHeaderView.js").extend({
  template: require("./ObjectsSidebar.html"),
  style:    require("./ObjectsSidebar.less"),

  data: function(){
    return {
      search: ""
    };
  },
});
