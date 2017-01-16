var App = require("App");
var _ = require("underscore");

module.exports = require("engine.lib.View").extend({
  template: require("./Header.html"),
  style: require("./Header.less"),
});
