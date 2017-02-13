// Resources namespace
// Contains collections
module.exports = {
  materials: new (require("lib/models/Materials/MaterialsCollection.js"))(
    require("lib/resources/materials/common.js")
  )
};