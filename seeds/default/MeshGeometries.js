
module.exports = function(cb){
  cb(null, [
    {
      name:             "SimpleCubeGeometry",
      geometry:         "CubeGeometry",
      geometry_options: [ 1, 1, 1 ]
    }
  ]);
}