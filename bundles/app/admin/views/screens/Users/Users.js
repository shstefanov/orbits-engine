
module.exports = require("View").extend({
  
  template: require("./Users.html"),
  style:    require("./Users.less"),

  onrender: function(){
    console.log("Users init here");
  }

});