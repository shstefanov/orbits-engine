const _                         = require("underscore");
const ThreejsViewportController = require("lib/controllers/ThreejsViewportController.js");
var data                        = require("game/data.js");
module.exports = ThreejsViewportController.extend("EditorViewportController", {
  initOrder:    2,
  config:       "viewport",
  observe: {
    "left_sidebar_state.__active": "updateViewportSize"
  }
});
