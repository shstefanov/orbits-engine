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

  // blockMaterials: {
  //   "dirt":  new THREE.MeshLambertMaterial({color: 0xCC0000 }),
  //   "grass": new THREE.MeshLambertMaterial({color: 0x00CC00 }),
  //   "water": new THREE.MeshLambertMaterial({color: 0x0000CC }),
  //   "stone": new THREE.MeshLambertMaterial({color: 0xAAAAAA }),
  // },

  // cube_geometry: new THREE.CubeGeometry( 1,1,1 ),
  }
});
