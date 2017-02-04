const UsersCollection = require("lib/models/Users/UsersCollection.js");
module.exports = require("View").extend({
  
  template: require("./Users.html"),
  style:    require("./Users.less"),

  onrender: function(){
    const app = require("app");
    var users = new UsersCollection();
    app.WebsocketController.getUsers({}, (err, result)=>{
      if(err) return alert(err);
      users.reset(result.users);
    });
    this.set("users", users);
  }

});