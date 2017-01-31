var App = require("App");

const BlocksCollection = require("game/models/Blocks/BlocksCollection.js");

module.exports = {
  blocks: new BlocksCollection(),
};