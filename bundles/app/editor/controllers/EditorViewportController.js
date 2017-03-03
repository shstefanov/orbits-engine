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
    "selectedGeometry":   [ "observeGeometry", "updateObject"],
    "selectedMeshModel":  "updateScene",
  },

  defaultGeometry:  new THREE.CubeGeometry(1, 1, 1),
  defaultMaterial:  new THREE.MeshNormalMaterial(),
  defaultmeshModel: new (require("lib/models/MeshModels/MeshModel.js")),

  resources: require("editor/resources.js"),

  bindResources: function(){
    this.createMaterials(this.resources.meshMaterials.models);
    this.resources.meshMaterials
      .on("add",    this.createMaterial, this )
      .on("change", this.updateMaterial, this )
      .on("change", this.updateObject,   this )
      .on("remove", this.removeMaterial, this )
      .on("reset",  (materials, event) => {
        this.removeMaterials(event.previousModels);
        this.createMaterials(materials.models);
      });

    this.createGeometries(this.resources.meshGeometries.models);
    this.resources.meshGeometries
      .on("add",    this.createGeometry, this )
      .on("change", this.updateGeometry, this )
      .on("change", this.updateObject,   this )
      .on("remove", this.removeGeometry, this )
      .on("reset",  (geometries, event)=>{
        this.removeGeometries(event.previousModels);
        this.createGeometries(geometries.models);
      });
  },

  updateObject: function(){
    // console.log("updateObject", arguments);
    var data = require("app").fetch({
      geometry:  "selectedGeometry",
      material:  "selectedMaterial",
    });

    var model = this.meshModel || this.defaultmeshModel;
    // console.log("-----------------");
    model.set({
      geometry: data.geometry || model.get("geometry"),
      material: data.material || model.get("material"),
    });
    // console.log("+++++++++++++++++");

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
