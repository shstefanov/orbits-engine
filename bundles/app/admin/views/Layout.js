var App = require("App");
var _ = require("underscore");

function parse(name, context, cb){ cb(name.split("/").shift()); }

module.exports = require("lib/views/BaseLayout.js").extend({
  template: require("./Layout.html"),
  style:    require("./Layout.less"),
  components: _.extend(
    App.bulk( require.context("./sections", true, /\.\/[^/]+\/[^\/]+\.js$/), parse ),
    App.bulk( require.context("./screens",  true, /\.\/[^/]+\/[^\/]+\.js$/), parse )
  )
});
