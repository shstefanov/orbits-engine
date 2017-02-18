const _                         = require("underscore");
const ThreejsViewportController = require("lib/controllers/ThreejsViewportController.js");
var data                        = require("game/data.js");
module.exports = ThreejsViewportController.extend("EditorViewportController", {
  initOrder:    2,
  config:       "viewport",
  observe: {
    "state.screen":       "updateViewportSize",
    "selectedMeshModel":  "selectedMeshModel",
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


  selectedMeshModel: function(model_id){
    var model = require("app").get("meshModels").get(model_id);
    console.log("??", model_id, model);

    if(this.objectModel){
      if(this.objectModel === model) return;
      else this.removeObjectModel();
    }

    model && this.addMeshModel(model);

  },

  removeObjectModel: function(){
    const model = this.objectModel;
    const mesh  = this.object_map.get(model);

    delete this.objectModel;
    this.scene.remove(mesh);

    this.object_map.delete(mesh);
    this.object_map.delete(model);
  },

  addMeshModel: function(model){
    const mesh = this.createMeshFromModel(model);
    if(!mesh) return;
    this.objectModel = model;
    this.object_map.set(mesh, model);
    this.object_map.set(model, mesh);
  }

});
