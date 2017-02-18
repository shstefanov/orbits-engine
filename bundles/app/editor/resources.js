// Resources namespace
// Contains collections
module.exports = {

  meshModels: new (require("lib/models/MeshModels/MeshModelsCollection.js")),

  materials: new (require("lib/models/Materials/MaterialsCollection.js"))(
    require("lib/resources/materials/common.js")
  )
};