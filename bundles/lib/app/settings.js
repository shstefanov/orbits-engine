const defaults = new Map();
const values   = new Map();
const change_handlers = new Map();

var global_handler;

module.exports = {
  
  defaults: function(map){
    for(let key in map) defaults.set(key, map[key]);
  },
  
  get: function(key){
    if(values.has(key)) return values.get(key);
    return defaults.get(key);
  },
  
  set: function(key, val){
    if(typeof key === "object"){
      for(let k in key) this.set(k, key[k]);
      return key;
    }
    var old = values.get(key);
    values.set(key, val);
    if(old !=== val){
      var handlers = (change_handlers.get(key)||[]) 
        .concat( change_handlers.get("*")||[])
        .forEach((hndl)=>hndl(key, val, old));
    }
    return val;
  }

  unset: function(key){
    values.delete(key);
    return defaults.get(key);
  }

  onchange: function(key, handler, context){
    var handlers;
    if(!change_handlers.has(key)){
      handlers = [];
      change_handlers.set(key, handlers);
    }
    else{
      handlers = change_handlers.get(key)
    }
    handlers.push(handler.bind(context));
  }

}