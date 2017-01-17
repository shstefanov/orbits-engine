var assert = require("assert");
var test = require("infrastructure/test_env");

var structure = "data";
var model     = "Users";
var target = function(method){ return [structure, model, method].join("."); };

describe(`Register user model\n  [${__filename}]`, function(){
  var env;
  it("Starts application", function(next){
    this.timeout(60000);
    test.start({ 
      only:         [structure],
      process_mode: "cluster", 
      options:      { drop: true }
    }, function(err, _env){
      assert.equal(err, null);
      env = _env;
      next();
    });
  });

  it("Registers user", function(next){
    env.i.do( target("register"), {
      username: "testuser",
      email: "testuser@test.com",
      password: "123456-aaaa",
      confirm:  "123456-aaaa",
      agree:    "on",

    }, function(err, token){
      assert.equal(err, null);
      assert.equal(/^[0-9a-f]{128}$/.test(token), true);
      next();
    });
  });

  var user;
  it("User exists", function(next){
    env.i.do( target("findOne"), {username: "testuser"}, function(err, _user){
      assert.equal(err, null);
      user = _user;
      next();
    })
  });

  it("Can not login without verification", function(next){
    env.i.do( target("login"), {username: user.username, password: "123456-aaaa"}, function(err, user){
      assert.equal(user, null);
      assert.equal(err, "Wrong username or password");
      next();
    });
  });

  var verify_token;
  it("Get token", function(next){
    env.i.do( target("findOne"), {username: user.username}, function(err, user){
      assert.equal(err, null);
      assert.equal(/^[0-9a-f]{128}$/.test(user.verify_token), true);
      verify_token = user.verify_token;
      next();
    });
  });

  // User should confirm it's registration by email
  it("Verifying user registration", function(next){
    env.i.do( target("verify"), verify_token, function(err, user){
      assert.equal(err, null);
      next();
    })
  });

  it("Login user", function(next){
    env.i.do( target("login"), {username: user.username, password: "123456-aaaa"}, function(err, user){
      assert.equal(err, null);
      assert.deepEqual(user, { username: 'testuser' });
      next();
    });
  });

  var new_password
  it("Forgots password", function(next){
    env.i.do( target("forgot"), "testuser@test.com", function(err, new_pass){
      assert.equal(err, null);
      new_password = new_pass;
      next();
    });
  });

  it("Can not login with old password", function(next){
    env.i.do( target("login"), {username: user.username, password: "123456-aaaa"}, function(err, user){
      assert.equal(user, null);
      assert.equal(err, "Wrong username or password");
      next();
    });
  });

  it("Can login with new password", function(next){
    env.i.do( target("login"), {username: user.username, password: new_password}, function(err, user){
      assert.equal(err, null);
      assert.deepEqual(user, { username: 'testuser' });
      next();
    });
  });

  it("Stops application", function(next){
    env.stop(function(err){
      assert.equal(err, null);
      next();
    });
  });


});
