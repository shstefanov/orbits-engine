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

  defaultObject: require("lib/models/Objects/ObjectModel.js"),

  resources: require("editor/resources.js"),

  bindResources: function(){
    this.resources.meshMaterials.each( (material)=>this.createMaterial(material) );
    this.resources.meshMaterials
      .on("add",    this.createMaterial, this )
      .on("change", this.updateMaterial, this )
      .on("remove", this.removeMaterial, this )
      .on("reset",  (collection, event)=>{ 
        event.previousModels.forEach( (material) => this.removeMaterial(material) );
        collection.each(              (material) => this.createMaterial(material) );
      });
  },

  // blockMaterials: {
  //   "dirt":  new THREE.MeshLambertMaterial({color: 0xCC0000 }),
  //   "grass": new THREE.MeshLambertMaterial({color: 0x00CC00 }),
  //   "water": new THREE.MeshLambertMaterial({color: 0x0000CC }),
  //   "stone": new THREE.MeshLambertMaterial({color: 0xAAAAAA }),
  // },

  // cube_geometry: new THREE.CubeGeometry( 1,1,1 ),


  selectedMeshModel: function(model_id){
    var app = require("app");
    var data = require("editor/data.js");

    if(!data.is_loaded){
      return app.once("data_loaded", this.selectedMeshModel.bind(this, model_id));
    }

    var object = new this.defaultObject({model: model_id});

    if(this.currentObject){
      if(this.currentObject === object) return;
      else this.removeObject();
    }

    object && this.addObject(object);

  },

  removeObject: function(){
    const object = this.currentObject;
    const mesh  = this.object_map.get(object);

    delete this.currentObject;
    mesh && this.scene.remove(mesh);

    this.object_map.delete(object);
    this.object_map.delete(mesh);
  },

  addObject: function(object){
    const mesh = this.createMeshFromObject(object);
    if(!mesh) return;
    this.currentObject = object;
    this.object_map.set(mesh, object);
    this.object_map.set(object, mesh);
  }

});
