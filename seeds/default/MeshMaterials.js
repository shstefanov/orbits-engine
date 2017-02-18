
module.exports = function(cb){
  cb(null, [
    {
      name:             "MeshDefaultLabmertMaterial",
      material:         "MeshLambertMaterial",
      material_options: [{color: 0xAAAAAA }]
    }
  ]);
}