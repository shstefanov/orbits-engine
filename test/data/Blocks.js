const assert = require("assert");
const infrastructure_test = require("infrastructure/test_env");

describe("Test test", function(){

  var env;

  it("Start", function(next){
    infrastructure_test.start({
      only: ["data"],
      options: {
        seed: {
          Blocks: "test/fixtures/blocks.js"
        }        
      },
    }, function(err, _env){
      assert.equal(err, null);
      env = _env;
      next();
    });
  });

  // it("Gets all blocks", function(next){
  //   env.i.do("data.Blocks.find", {}, function(err, blocks){
  //     assert.equal(err, null);
  //     console.log(blocks);
  //     next();
  //   });
  // });

  it("Stop", function(next){
    env.stop(function(err, _env){
      assert.equal(err, null);
      env = null;
      next();
    });
  });
});