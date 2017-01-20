var Page = require("../lib/http/BasePage");

// var passport         = require("passport");
// var FacebookStrategy = require("passport-facebook").Strategy;

module.exports = Page.extend("AuthPage", {
  // constructor: function(env){
  //   var settings = env.helpers.resolve(env.config, this.config);
  //   if(!settings) throw new Error("Can't resolve authorization settings at: "+this.config);
  //   settings.callbackUrl = "http://"+env.config.host+"/auth/fbcallback";
  //   var app = env.engines.express;

  //   passport.serializeUser(this.serializeUser.bind(this));
  //   passport.deserializeUser(this.deserializeUser.bind(this));

  //   passport.use(new FacebookStrategy({
  //     clientID:     settings.appID,
  //     clientSecret: settings.appSecret,
  //     callbackURL:  settings.callbackUrl
  //   }, function(accessToken, refreshToken, profile, done) {
  //     env.i.do("models.Users.facebookLogin", profile, function(err, user){
  //       done(err, user);
  //     });
  //   }));

  //   this["GET /fblogin"] = passport.authenticate('facebook', {scope: "email"});

  //   var self = this;
  //   this["GET /fbcallback"] = function(req, res, next){
  //     passport.authenticate('facebook', { failureRedirect : self.root + "/fberror" })(req, res, function(err){
  //       if(err) return next(err);
  //       req.session.logged = true;
  //       req.session.user = req.user;
  //       res.redirect(302, '/');
  //     });
  //   };

  //   app.use(this.root, passport.initialize());

  //   return Page.apply(this, arguments);


  // },


  "root":      "/auth",
  "template":  "auth/login.mustache",

  "title": "Orbits",

  "http_auth_config": "secret.game_http_auth",

  "config": "secret.social.fb",

  "styles": [
    "/public/dist/game.bundle.css"
  ],

  "pre": [
    "@redirectIf | req.session.logged && ( req.path !== '/auth/logout' ), res, '/', 302"
  ],
  
  "GET /":         "#auth/login.mustache",
  "GET /login":    "#auth/login.mustache",
  "GET /register": "#auth/register.mustache",

  "GET /logout": [
    "@destroySession | req.session",
    "@redirectIf | true, res, '/auth', 302"
  ],

  "POST /login":   [
    "@set | res.data, 'body', req.body",
    "models.Users.login | req.body | user",
    "@set | req.session, 'logged', true",
    "@set | req.session, 'user', res.data.user",
    "@redirect | !!res.data.user, res, '/', 302",
    "@handleError | 'Unknown error', req, res"
  ],

  "POST /register":   [
    "#auth/register.mustache",
    "@set | res.data, 'body', req.body",
    "models.Users.register | req.body | token",
    "@set | req.session, 'token', res.data.token",
    "mails.auth.sendRegistrationVerification | {token: res.data.token, username: req.body.username }, {to:req.body.email} | mail_info",
    "@redirect | !!res.data.token, res, '/auth/thank-you', 302",
    "@handleError | 'Unknown error', req, res"
  ],

  "GET /thank-you": "#auth/thank_your.mustache",

  "GET /verify/:token": [
    "#auth/verify.mustache",
    "models.Users.verify | req.params.token | result",
    "@redirect | res.data.result, res, '/auth/login', 302",
    "@handleError | 'Unknown error', req, res"
  ],





  fbsuccess: function(req, res, next){
    console.log("FB SUCCESS");
  },

  fberror: function(req, res, next){
    console.log("FB ERROR");
  },

  serializeUser: function(user, cb){
    cb(null, user._id);
  },

  deserializeUser: function(id, cb){
    this.env.i.do("models.Users.findOne", {_id: id}, {$objectify: "_id"}, cb );
  },

});
