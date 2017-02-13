const _                         = require("underscore");
const ThreejsViewportController = require("lib/controllers/ThreejsViewportController.js");
var data                        = require("game/data.js");
module.exports = ThreejsViewportController.extend("EditorViewportController", {
  initOrder:    2,
  config:       "viewport",
  observe: {
    "state.screen": "updateViewportSize"
  resources: function(){
    const data = require("editor.data");
    return _.pick(data, [
      "objectModels",
      "materials",
      "geometries",
    ]);
  },

  }
});
