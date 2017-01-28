var Page = require("./BasePage");

module.exports = Page.extend("AuthorizedPage", {
  
  pre: [
    `@redirectIf | !req.session.logged, 
      res, this.env.config.http_endpoints.not_authorized_redirect, 302`
  ]  

});

