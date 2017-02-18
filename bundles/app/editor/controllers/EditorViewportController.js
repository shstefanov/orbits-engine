const _                         = require("underscore");
const ThreejsViewportController = require("lib/controllers/ThreejsViewportController.js");
const data                      = require("game/data.js");

const THREE = ThreejsViewportController.prototype.THREE;

module.exports = ThreejsViewportController.extend("EditorViewportController", {
  initOrder:    2,
  config:       "viewport",
  observe: {
    "state.screen":       "updateViewportSize",
    "selectedMeshModel":  "selectedMeshModel",
    "selectedMaterial":   "selectedMaterial",
    "selectedGeometry":   "selectedGeometry",
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
        materials.each(              (material) => this.createMaterial(material) );
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

  // blockMaterials: {
  //   "dirt":  new THREE.MeshLambertMaterial({color: 0xCC0000 }),
  //   "grass": new THREE.MeshLambertMaterial({color: 0x00CC00 }),
  //   "water": new THREE.MeshLambertMaterial({color: 0x0000CC }),
  //   "stone": new THREE.MeshLambertMaterial({color: 0xAAAAAA }),
  // },

  // cube_geometry: new THREE.CubeGeometry( 1,1,1 ),

  selectedMaterial: function(material_id){
    console.log("selectedMaterial", material_id);
  },

  selectedMeshModel: function(model_id){
    console.log("selectedMeshModel", model_id);
  },

  selectedGeometry: function(geometry_id){
    console.log("selectedGeometry", geometry_id);
  },

});
