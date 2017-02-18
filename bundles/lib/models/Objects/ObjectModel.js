
module.exports = require("lib/models/BaseModel.js").extend("Object", {
  defaults: {

    model: "DefaultCubeModel",

    // coordinates
    x: 0, y: 0, z: 0,

    // rotation
    rx: 0, ry: 0, rz: 0,

    // scale
    sx: 1, sy: 1, sz: 1,

  }
});




