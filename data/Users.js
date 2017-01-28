var crypto  = require('crypto');
var bcrypt  = require('bcrypt');
var _       = require("underscore");
var helpers = require("infrastructure/lib/helpers");

function genSalt(ctx, cb){
  bcrypt.genSalt(10, function(err, salt) {
    if(err) return cb(err);
    ctx.salt = salt; cb(null, ctx);
  });
}

function genHash(ctx, cb){
  bcrypt.hash(ctx.password, ctx.salt, function(err, hash) {
    if(err) return cb(err);
    ctx.hash = hash;
    cb(null, ctx);
  });
}

module.exports = require("infrastructure-mongodb/MongoLayer").extend("UsersLayer", {

  collectionName: "Users",

  publicFields:   ["username", "avatar", "roles"],

  fields:         ["_id", "email", "username", "password", "avatar", "verified", "verify_token", "roles"],

  callable: ["login", "register", "facebookLogin", "find", "findOne", "update", "verify", "forgot"],

  index: [
    { index : { email: 1    }, options: { unique: true } },
    { index : { username: 1 }, options: { unique: true } },
  ],

  defaults: {
    roles: ["player"]
  },

  login: helpers.chain([

    function(credentials, options, cb){

      const find_user_query = {
        $or: [
          { username : credentials.username },
          { email :    credentials.username },
       ]
     };

     find_user_query.verified = true;

      cb(null, {
        password: credentials.password,
        query:    find_user_query,
      });
    },

    function(ctx, cb){
      this.findOne( ctx.query, {}, function(err, user){
        if(err) return cb(err);
        ctx.user = user;
        cb(null, ctx);
      });
    },
    function(ctx, cb){
      if(!ctx.user) return cb("Wrong username or password");
      bcrypt.compare(ctx.password, ctx.user.password, function(err, res) {
        if(err) return cb(err);
        if(!res) return cb("Wrong username or password");
        cb(null, ctx);
      });
    },

    function(ctx, cb){
      cb(null, _.pick(ctx.user, this.publicFields));
    }
  ]),
  

  validate_register_data: {
    email:    function(val){ return typeof val === "string" && val.indexOf("@") > 1; },
    password: function(val){ return typeof val === "string" && val.length >= 6;                 },
    username: function(val){ return typeof val === "string" && /^[a-z,0-9_-]{6,16}$/.test(val); },
    confirm:  function(val, data){ return val === data.password; },
    agree:    function(val){ return typeof val === "string" && val === "on"; },
  },

  register: helpers.chain([
    
    function(data, options, cb){

      var self  = this, result;
      var valid = _.chain(this.validate_register_data)
        .mapObject(function(val, key){ return val.call(self, data[key], data); })
        .tap(function(r){ result = r; })
        .values().every().value();
      if(!valid) return cb("Invalid form data");

      cb(null, {
        password:       data.password,
        user_data:      _.defaults(_.clone( data ), this.defaults),
        config:         this.env.config
      });
    },

    genSalt, genHash,

    function(ctx, cb){
      ctx.db_data = _.extend({}, _.pick(ctx.user_data, this.fields), { password: ctx.hash, verified: false });
      if(this.env.config.default_avatar) ctx.db_data.avatar = this.env.config.default_avatar;
      cb(null, ctx);
    },

    function(ctx, cb){
      var self = this;
      function createToken(){
        var token = crypto.randomBytes(64).toString('hex');
        self.findOne({verify_token: token}, {}, function(err, user){       if(err) return cb(err);
          if(user) return createToken();
          ctx.db_data.verify_token = token;
          cb(null, ctx);
        });
      }
      createToken();
    },

    function(ctx, cb){
      var fields = this.publicFields;
      this.create(ctx.db_data, {}, function(err, doc){                       if(err) return cb(err);
        cb(null, doc.verify_token);
      });
    }
  ]),

  facebookLogin: helpers.chain([
    function(profile, opts, cb){ cb(null, { profile: profile }); },
    function(ctx, cb){
      this.findOne({fb_id: ctx.profile.id}, {}, function(err, user){
        if(err) return cb(err);
        ctx.user = user;
        cb(null, ctx);
      });
    },
    function(ctx, cb){
      if(ctx.user) return cb(null, ctx.user);
      this.create({
        fb_id : ctx.profile.id,
        avatar: "//graph.facebook.com/" + ctx.profile.id + "/picture?type=square",
        username: ctx.profile.displayName.split(" ").shift()
      }, {}, cb );
    }
  ]),

  verify: helpers.chain([
    function(token, options, cb){
      if(!/^[0-9a-f]{128}$/.test(token)) return cb("Invalid token");
      cb(null, { token: token });
    },

    function(ctx, cb){
      this.findOne({verify_token: ctx.token}, {fields: ["_id"]}, function(err, user){     if(err) return cb(err);
        if(!user) return cb("Invalid token");
        ctx.user = user;
        cb(null, ctx);
      });
    },

    function(ctx, cb){
      this.update({_id: ctx.user._id}, {$unset:{verify_token:1}, $set:{verified: true}}, function(err){     if(err) return cb(err);
        cb(null, true);
      });
    }
  ]),

  // Retusrns generated password
  forgot: helpers.chain([
    function(email, options, cb){
      if(typeof email !== "string") return cb("Invalid email");
      cb(null, {email: email});
    },
    function(ctx, cb){
      this.findOne({email: ctx.email}, {}, function(err, user){ if(err) return cb(err);
        if(!user) return cb("Can't find user");
        ctx.user = user;
        cb(null, ctx);
      });
    },


    genSalt, function(ctx, cb){ ctx.password = ctx.salt; cb(null, ctx); },

    genSalt, genHash, function(ctx, cb){
      this.update({_id: ctx.user._id}, {$set:{password:ctx.hash}}, function(err){   if(err) return cb(err);
        cb(null, ctx.password);
      });
    }
  ])


});
