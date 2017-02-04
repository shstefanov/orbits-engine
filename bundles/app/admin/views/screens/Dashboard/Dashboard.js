module.exports = require("View").extend({
  
  template: require("./Dashboard.html"),
  style:    require("./Dashboard.less"),

  onrender: function(){
    console.log("Dashboard init here");
  }

});