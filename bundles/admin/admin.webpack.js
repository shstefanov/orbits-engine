var Bundler = require("infrastructure-webpack/Bundler");

module.exports = Bundler.extend("AdminBundler", {

  CONFIG: {},

  "name": "admin",
  "entry": ["./admin.index.less", "./admin.index.js"],
  "output": "bundles/admin/admin.bundle.js",
  "styleFilename": "bundles/admin/admin.bundle.css",
  "chunks": {
    "vendor": {
      "output": "bundles/admin/admin.vendor.js",
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
      "View":               "infrastructure-appcontroller-ractive/ractive-backbone-view",
      "data":               "admin.data",
      "resources":          "admin.resources",
    },

    "fileLoaders": {
      
      "bundles/admin/images": {
        "extensions": ["gif", "jpe?g", "png", "svg", "bmp" ],
        "inlineLimit": 1,
        "name": "[hash].[ext]"
      },

      "bundles/admin/fonts": {
        "extensions": ["woff", "eot", "ttf", "woff2" ],
        "inlineLimit": 1,
        "name": "[hash].[ext]"
      }
    }

});

