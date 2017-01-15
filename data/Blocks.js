var MongoLayer =require("infrastructure-mongodb/MongoLayer");

module.exports = MongoLayer.extend("Blocks", {
  collectionName: "Blocks",
});