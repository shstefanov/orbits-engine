const _                         = require("underscore");
const ThreejsViewportController = require("lib/controllers/ThreejsViewportController.js");
const data                      = require("game/data.js");

const THREE = ThreejsViewportController.prototype.THREE;

module.exports = ThreejsViewportController.extend("EditorViewportController", {
  initOrder:    2,
  config:       "viewport",
  observe: {
    "state.screen":       "updateViewportSize",
    "selectedMaterial":   "updateObject",
    "selectedGeometry":   "updateObject",
    "selectedMeshModel":  "updateScene",
  },

  defaultGeometry:  new THREE.CubeGeometry(1, 1, 1),
  defaultMaterial:  new THREE.MeshNormalMaterial(),
  defaultmeshModel: new (require("lib/models/MeshModels/MeshModel.js")),

  resources: require("editor/resources.js"),

  bindResources: function(){
    this.resources.meshMaterials.each( (material)=>this.createMaterial(material) );
    this.resources.meshMaterials
      .on("add",    this.createMaterial, this )
      .on("change", this.updateMaterial, this )
      .on("remove", this.removeMaterial, this )
      .on("reset",  (materials, event)=>{
        event.previousModels.forEach( (material) => this.removeMaterial(material) );
        materials.each(               (material) => this.createMaterial(material) );
      });

    this.resources.meshGeometries.each( (geometry)=>this.createGeometry(geometry) );
    this.resources.meshGeometries
      .on("add",    this.createGeometry, this )
      .on("change", this.updateGeometry, this )
      .on("remove", this.removeGeometry, this )
      .on("reset",  (geometries, event)=>{
        event.previousModels.forEach( (geometry) => this.removeGeometry(geometry) );
        geometries.each(              (geometry) => this.createGeometry(geometry) );
      });
  },

  updateObject: function(){
    var data = require("app").fetch({
      geometry:  "selectedGeometry",
      material:  "selectedMaterial",
    });

    var model = this.meshModel || this.defaultmeshModel;

    model.set({
      geometry: data.geometry || model.get("geometry"),
      material: data.material || model.get("material"),
    });

    this.setMeshModel(model);

  },

  updateScene: function(model_id){
    this.setMeshModel(this.resources.meshModels.get(model_id) || this.defaultmeshModel);
  },

  /*
  ** MeshModels lifecycle
  */
  setMeshModel: function(model){
    this.removeMeshModel();
    if(model){
      this.meshModel = model;
      this.currentMesh = this.createMeshFromModel(model);
      this.scene.add(this.currentMesh);
    }
  },

  removeMeshModel: function(){
    if(this.meshModel){
      var model = this.meshModel;
      delete this.meshModel;
      var mesh = this.currentMesh;
      delete this.currentMesh;
      this.scene.remove(mesh);
    }
  }

});
