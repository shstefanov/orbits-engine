const App = require("App");
const helpers = require("infrastructure/lib/helpers");

class Resources{
  get(path){ return helpers.resolve(this, path);      }
  set(path, value){ helpers.patch(this, path, value); }
}

const resources = new Resources();

const context = require.context("./", true);
context.keys().forEach(function(path){
  if(path.match(/^\.\/index(\.js)?$/)) return;
  const value  = context(path);
  var new_path = path
    .replace("./", "")
    .replace(/^(.*)(\.\w+)$/, "$1")
    .replace(/\./, "_")
    .replace(/\//, ".");
  resources.set(new_path, value);
});

module.exports = resources;
