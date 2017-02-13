const _                         = require("underscore");
const ThreejsViewportController = require("lib/controllers/ThreejsViewportController.js");
var data                        = require("game/data.js");
module.exports = ThreejsViewportController.extend("EditorViewportController", {
  initOrder:    2,
  config:       "viewport",
  observe: {
    "state.screen":       "updateViewportSize",
    "currentObjectModel": "setObjectModel",
  },

  resources: function(){
    return require("editor/resources.js");
  },

  // blockMaterials: {
  //   "dirt":  new THREE.MeshLambertMaterial({color: 0xCC0000 }),
  //   "grass": new THREE.MeshLambertMaterial({color: 0x00CC00 }),
  //   "water": new THREE.MeshLambertMaterial({color: 0x0000CC }),
  //   "stone": new THREE.MeshLambertMaterial({color: 0xAAAAAA }),
  // },

  // cube_geometry: new THREE.CubeGeometry( 1,1,1 ),


  setObjectModel: function(model){
    if(this.objectModel){
      if(this.objectModel === model) return;
      else this.removeObjectModel();
    }

    if(model){
      this.addObjectModel(require("app").get("currentObjectModel"));
    }
  },

  removeObjectModel: function(){
    const model = this.objectModel;
    const mesh  = this.object_map.get(model);

    delete this.objectModel;
    this.scene.remove(mesh);

    this.object_map.delete(mesh);
    this.object_map.delete(model);
  },

  addObjectModel: function(model){
    console.log("addObjectModel", model);
    const mesh = this.createMeshFromModel(model);
    if(!mesh) return;
    this.objectModel = model;
    this.object_map.set(mesh, model);
    this.object_map.set(model, mesh);
  }

});
