const _                  = require("underscore");
const ViewportController = require("ViewportController");
var data                 = require("data");
module.exports = ViewportController.extend("MapViewportController", {
  initOrder:    2,
  config:       "viewport",
  data:         _.pick(data, ["blocks"] ),
  resources:    require("resources"),
});
