var infrastructure = require("infrastructure");

infrastructure({}, function(err, env){
  if(err) return console.log("ERROR: ", err);
});