
module.exports = function(cb){
  const dataLayers = this.env.i.data;
  Promise.all([

    new Promise(function(done, error){
      dataLayers.MeshGeometries.collection.findOne({ name: "SimpleCubeGeometry" }, function(err, geometry){
        err ? error(err) : ( geometry ? done(geometry) : error("Can't find geometry") );
      });
    }),

    new Promise(function(done, error){
      dataLayers.MeshMaterials.collection.findOne({ name: "Basic Mesh Material", }, function(err, material){
        err ? error(err) : ( material ? done(material) : error("Can't find material") );
      });
    }),

  ]).then(function(results){
    
    const geometry = results[0];
    const material = results[1];

    cb(null, [
      {
        name:             "Basic Cube Model",
        geometry:         geometry._id,
        material:         material._id,
      }
    ]);

  }).catch((err)=>cb(err));

}