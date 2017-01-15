var infrastructure = require("infrastructure");

infrastructure({}, function(err, env){
  if(err) return console.log("ERROR: ", err);
  
  // Manualy handling --exit cli option
  if(env.config.options.exit === true){
    env.stop(function(err){
      if(err) return console.error(err);
    });
  }
});