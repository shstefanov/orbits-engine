



const shapes = {
  // z - (x * x) - (y * y)
  shape_1: function(size, reduce){
    const blocks = [];
    const half = size / 2;

    for(let x = 0; x < size; x++){
      for(let z = 0; z < size; z++){
        blocks.push({
          x: half - x, z: half - z,
          y: Math.round( ( (x * x) - (z * z) ) / reduce ),
          type:  "grass", //block_types[Math.floor(Math.random() * 4)]
        });
      }
    }

    return blocks;
  },

  shape_2: function(size, reduce){
    const blocks = [];
    const half = size / 2;
    for(let x = 0; x < size; x++){
      for(let z = 0; z < size; z++){
        blocks.push({
          x: half - x, z: half - z,
          y: Math.round( ( Math.sin(x/(size/4)) - Math.sin(z/(size/4)) ) / reduce ),
          type:  "grass", //block_types[Math.floor(Math.random() * 4)]
        });
      }
    }
    return blocks;
  }
}









module.exports = function(cb){
  // cb(null, shapes.shape_1(64, 300));
  cb(null, shapes.shape_2(128, 1/32));
}