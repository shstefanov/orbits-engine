
module.exports = function(cb){
  cb(null, [
    
    {
      name:             "DefaultCubeModel",
      geometry:         "DefaultCubeGeometry",
      geometry_options: [ 1, 1, 1 ],
      material:         "DefaultLambertMaterial",
      material_options: { color: 0xAAAAAA }
    }

  ]);
}