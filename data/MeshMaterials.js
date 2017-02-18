var MongoLayer =require("infrastructure-mongodb/MongoLayer");

module.exports = MongoLayer.extend("MeshMaterials", {
  seed:           "seeds.MeshMaterials",
  collectionName: "MeshMaterials",
});