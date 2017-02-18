module.exports = require("lib/models/BaseModel.js").extend("MeshModel", {
  defaults: {

    material: "MeshLambertMaterial",
    material_options: [{ color: 0xCCCCCC }],

    geometry: "CubeGeometry",
    geometry_options: [1, 1, 1]


  }
});