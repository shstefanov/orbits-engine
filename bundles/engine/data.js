var App = require("App");

const BlocksCollection = require("engine.models.Blocks.BlocksCollection");

module.exports = {
  blocks: new BlocksCollection(),
};