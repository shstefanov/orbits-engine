const BaseView = require("./BaseView.js");
module.exports = BaseView.extend({
  partials: {
    // TODO: Think about how to remove manually called "raw!" loader
    UserContext: require("raw!common-templates/user-context.html")
  }
});