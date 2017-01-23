module.exports = function(cb){
  const size = 20;
  const block_types = ["grass", "water", "dirt", "stone"];
  const blocks = [];
  for(let x = 0; x < 20; x++){
    for(let z = 0; z < 20; z++){
      blocks.push({
        x: x,
        y: 0,
        z: z,
        type:  block_types[Math.floor(Math.random() * 4)]
      });
    }
  }
  cb(null, blocks);
}