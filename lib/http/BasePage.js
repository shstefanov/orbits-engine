var Page = require("infrastructure-express/Page");

module.exports = Page.extend("BasePage", {
  
  redirectIf: function(cond, res, url, code, cb){
    if(cond) res.redirect(code, url);
    else cb();
  },

  saveSession: function(session, cb){
    session.save(cb);
  },

  destroySession: function(session, cb){ 
    session.destroy(cb); 
  },

  set: function(target, key, val, cb){
    target[key] = val;
    cb();
  },

  handleError: function(err, req, res, next){
    res.data.error = err;
    this.render(req, res);
  },

});

