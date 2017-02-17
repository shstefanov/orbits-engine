var MongoLayer =require("infrastructure-mongodb/MongoLayer");

module.exports = MongoLayer.extend("MeshModels", {
  seed:           "seeds.MeshModels",
  collectionName: "MeshModels",
});