var Bundler = require("infrastructure-webpack/Bundler");

module.exports = Bundler.extend("PanelBundler", {

  CONFIG: {},

  "name": "engine",
  "entry": ["./engine.index.js", "./engine.index.less"],
  "output": "bundles/engine/engine.bundle.js",
  "styleFilename": "bundles/engine/engine.bundle.css",
  "chunks": {
    "vendor": {
      "output": "bundles/engine/engine.vendor.js",
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
      "ViewportController": "engine.lib.ViewportController",
      "View":               "infrastructure-appcontroller-ractive/ractive-backbone-view",
      "data":               "engine.data",
      "resources":          "engine.resources",
    },

    "fileLoaders": {
      
      "bundles/engine/images": {
        "extensions": ["gif", "jpe?g", "png", "svg", "bmp" ],
        "inlineLimit": 1,
        "name": "[hash].[ext]"
      },

      "bundles/engine/fonts": {
        "extensions": ["woff", "eot", "ttf", "woff2" ],
        "inlineLimit": 1,
        "name": "[hash].[ext]"
      }
    }

});

