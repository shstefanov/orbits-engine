const UsersCollection = require("lib/models/Users/UsersCollection.js");
const _ = require("underscore");

module.exports = require("View").extend({
  
  template: require("./Users.html"),
  style:    require("./Users.less"),

  data: function(){
    return {
      // From global config - config.bundles.USER_ROLES
      user_roles: USER_ROLES
    };
  },

  onrender: function(){
    const app = require("app");
    var users = new UsersCollection();
    app.WebsocketController.getUsers({}, (err, result)=>{
      if(err) return alert(err);
      users.reset(result.users);
    });
    this.set("users", users);
  },

  toggleRole: function(user, role){
    const roles = user.get("roles");
    if(roles.indexOf(role) > -1) roles.splice(roles.indexOf(role), 1);
    else                         roles.push(role);
    console.log("save user here");
  },

  saveUser: function(user){
    require("app").WebsocketController.updateUser(user, function(err, result){
      if(err) return alert(err);
      console.log("update result: ", result);
    });
  }

});