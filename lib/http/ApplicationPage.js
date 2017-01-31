var Page = require("./AuthorizedPage");

module.exports = Page.extend("ApplicationPage", {
  template: "app_template.mustache",
  pre: Page.prototype.pre.concat([
    `@redirectIf |
      this.user_roles && !_.intersection( this.user_roles, req.session.user.roles ).length,
      res, this.env.config.http_endpoints.error_permissoin_denied, 302`
  ])
});

