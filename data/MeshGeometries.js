var MongoLayer =require("infrastructure-mongodb/MongoLayer");

module.exports = MongoLayer.extend("MeshGeometries", {
  seed:           "seeds.MeshGeometries",
  collectionName: "MeshGeometries",
});