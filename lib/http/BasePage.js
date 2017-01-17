var Page = require("infrastructure-express/Page");

module.exports = Page.extend("BasePage", {
  redirectIf: function(cond, res, url, code, cb){
    if(cond) res.redirect(code, url);
    else cb();
  },
});

