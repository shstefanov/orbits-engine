var MongoLayer =require("infrastructure-mongodb/MongoLayer");
// https://docs.mongodb.com/v3.2/tutorial/build-a-2d-index/
// https://docs.mongodb.com/v3.2/tutorial/query-a-2d-index/
module.exports = MongoLayer.extend("Blocks", {
  collectionName: "Blocks",
});