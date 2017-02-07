const _                         = require("underscore");
const ThreejsViewportController = require("lib/controllers/ThreejsViewportController.js");
var data                        = require("game/data.js");
module.exports = ThreejsViewportController.extend("MapViewportController", {
  initOrder:    2,
  config:       "viewport",
  data:         _.pick(data, ["voxels"] ),
  resources:    require("game.resources"),
  // observe: {
  //   "voxels.*": "viewVoxels"
  // },
  // viewVoxels: function(){
  //   console.log("viewVoxels", arguments);
  // }

  bindCollection: {
    voxels: {
      "reset" :                     "resetVoxels",
      "add":                        "addVoxel",
      "remove":                     "removeVoxel",
      "change:x change:y change:z": "changeVoxel",
    }
  },

  resetVoxels: function(voxels, data){
    if(data.previousModels) data.previousModels.forEach((voxel)=>{ this.removeVoxel(voxel) });
    voxels.forEach((voxel)=>this.addVoxel(voxel));
  },

  addVoxel: function(object){
    const type = object.get("type");
    const material = this.blockMaterials[type];
    const mesh = new this.THREE.Mesh(this.cube_geometry, material);
    const {x,y,z} = object.pick(["x", "y", "z"]);
    mesh.position.set(x,y,z);

    this.object_map.set(object, mesh);

    this.dom_events.addEventListener(mesh, 'mouseover', function(e){
      mesh.translateY(0.25);
    }, false );
    this.dom_events.addEventListener(mesh, 'mouseout', function(e){
      mesh.translateY(-0.25);
    }, false );

    this.dom_events.addEventListener(mesh, 'click', function(e){
      window.mesh = mesh;
      console.log("mesh: ", mesh);
    }, false );

    this.scene.add(mesh);
  },

  removeVoxel: function(voxel){
    const mesh = this.object_map.get(voxel);
    if(mesh){
      this.scene.remove(mesh);
    }
  },

  changeVoxel: function(object){
    const mesh = this.object_map.get(object);
    if(mesh){
      const { x, y, z } = object.attributes;
      mesh.position.set(x,y,z);
    }
  }

});
