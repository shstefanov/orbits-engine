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

  blocks.forEach(function(block){

    // 80% chance to repeat the block at y: 1
    if(Math.random() < 0.8) {
      blocks.push(
        Object.assign(
          Object.assign({}, block), { y: 1 }
        )
      )
    }

    // 50% chance to repeat the block at y: 2
    if(Math.random() < 0.5) {
      blocks.push(
        Object.assign(
          Object.assign({}, block), { y: 2 }
        )
      )
    }

    // 20% chance to repeat the block at y: 3
    if(Math.random() < 0.2) {
      blocks.push(
        Object.assign(
          Object.assign({}, block), { y: 3 }
        )
      )
    }

  });

  cb(null, blocks);
}