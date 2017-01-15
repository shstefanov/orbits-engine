var MongoLayer =require("infrastructure-mongodb/MongoLayer");

module.exports = MongoLayer.extend("Blocks", {
  seed:           "seeds.Blocks",
  collectionName: "Blocks",
});