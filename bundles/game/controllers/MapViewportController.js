const _                  = require("underscore");
const ViewportController = require("ViewportController");
var data                 = require("game.data");
module.exports = ViewportController.extend("MapViewportController", {
  initOrder:    2,
  config:       "viewport",
  data:         _.pick(data, ["blocks"] ),
  resources:    require("game.resources"),
});
