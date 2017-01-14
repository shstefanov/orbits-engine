var infrastructure = require("infrastructure");

infrastructure({
  process_mode: "single",
  structures: {
    log: {engine: "log", options: {sys: true, build: true}},
    webpack: {
      "path":   ["bundles", "*/*.webpack.js"    ],
      "engine":  "infrastructure-webpack/engine",
      "loader":  "infrastructure-webpack/loader",

      "config": {
        "webpack": {
          "watch":            true,
          "progress":         true,
          "buildDestination": "./public",
          "publicPath":       "/public",
          "sourceMap":        true,
        }
      }
    }
  }
}, function(err, env){

});