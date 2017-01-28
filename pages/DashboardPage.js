var Page = require("../lib/http/BasePage");

module.exports = Page.extend("DashboardPage", {

  title: "Infrastructure Engine Dashboard",
  
  root: "/dashboard",
  
  pre:  [
    `@redirectIf | !req.session.logged, 
      res, this.env.config.http_endpoints.not_authorized_redirect, 302`
  ],

  "GET /": [
    "@set | res.data, 'user', req.session.user",
    
    // TODO - create separate method to format user roles data
    `@set | res.data, 'roles', 
      _.chain(this.env.config.http_endpoints.roles_access_links)
      .pick(res.data.user.roles)
      .values()
      .value()`
  ],

  after: "#dashboard.mustache",

});