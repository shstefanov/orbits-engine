module.exports = require("lib/models/BaseModel.js").extend("ObjectModel", {
  defaults: {
    // coordinates
    x: 0, y: 0, z: 0,

    // rotation
    rx: 0, ry: 0, rz: 0,

    // scale
    sx: 1, sy: 1, sz: 1,

    material: "MeshLambertMaterial",
    material_options: [{ color: 0xCCCCCC }],

    geometry: "CubeGeometry",
    geometry_options: [1, 1, 1]


  }
});