var Bundler = require("infrastructure-webpack/Bundler");

module.exports = Bundler.extend("GameBundler", {

  CONFIG: {},

  "name": "game",
  "entry": [ "./game.index.less", "./game.index.js"],
  "output": "bundles/game/game.bundle.js",
  "styleFilename": "bundles/game/game.bundle.css",
  "chunks": {
    "vendor": {
      "output": "bundles/game/game.vendor.js",
      "modules": [
        "underscore",
        "backbone",
        "ractive",
        "ractive/ractive.runtime.js",
        "View",
        "infrastructure/lib/helpers",
        "infrastructure-appcontroller-ractive",
        "infrastructure/lib/ExtendedModel",
        "infrastructure/lib/ExtendedCollection",
        "infrastructure/lib/client/Controller",
        "three",
        "three-orbit-controls",
        "socket.io-client",
      ]
    }
  },

    "loaders": [
     
    ],

    // "config": {
    //   "SOME_FUNC": function(){ console.log("WHOAAAAAA!!!") },
    // },

    "alias": {
      "ViewportController": "game.lib.ViewportController",
      "View":               "infrastructure-appcontroller-ractive/ractive-backbone-view",
      "data":               "game.data",
      "resources":          "game.resources",
    },

    "fileLoaders": {
      
      "bundles/game/images": {
        "extensions": ["gif", "jpe?g", "png", "svg", "bmp" ],
        "inlineLimit": 1,
        "name": "[hash].[ext]"
      },

      "bundles/game/fonts": {
        "extensions": ["woff", "eot", "ttf", "woff2" ],
        "inlineLimit": 1,
        "name": "[hash].[ext]"
      }
    }

});

