
module.exports = function(cb){
  cb(null, [

    /*
      Line Materials
    */

    {
      name:             "Basic Line Material",
      description:      "Basic Line Material",
      material:         "LineBasicMaterial",

      /*
      *  color: <hex>,
      *  opacity: <float>,
      *
      *  linewidth: <float>,
      *  linecap: "round",
      *  linejoin: "round"
      */
      material_options: [{color: 0xAAAAAA }]
    },

    
    {
      name:             "Dashed Line Material",
      description:      "Dashed Line Material",
      material:         "LineDashedMaterial",

      /*
      *  color: <hex>,
      *  opacity: <float>,
      *
      *  linewidth: <float>,
      *
      *  scale: <float>,
      *  dashSize: <float>,
      *  gapSize: <float>
      */
      material_options: [{color: 0xAAAAAA }]
    },






    {
      name:             "Basic Mesh Material",
      description:      "Basic Mesh Material",
      material:         "MeshBasicMaterial",

      /*
      *  color: <hex>,
      *  opacity: <float>,
      *  map: new THREE.Texture( <Image> ),
      *
      *  lightMap: new THREE.Texture( <Image> ),
      *  lightMapIntensity: <float>
      *
      *  aoMap: new THREE.Texture( <Image> ),
      *  aoMapIntensity: <float>
      *
      *  specularMap: new THREE.Texture( <Image> ),
      *
      *  alphaMap: new THREE.Texture( <Image> ),
      *
      *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
      *  combine: THREE.Multiply,
      *  reflectivity: <float>,
      *  refractionRatio: <float>,
      *
      *  shading: THREE.SmoothShading,
      *  depthTest: <bool>,
      *  depthWrite: <bool>,
      *
      *  wireframe: <boolean>,
      *  wireframeLinewidth: <float>,
      *
      *  skinning: <bool>,
      *  morphTargets: <bool>
      */
      material_options: [{color: 0xAAAAAA }]
    },

    {
      name:             "Mesh Depth Material",
      description:      "Mesh Depth Material",
      material:         "MeshDepthMaterial",
      /*
      *  opacity: <float>,
      *
      *  map: new THREE.Texture( <Image> ),
      *
      *  alphaMap: new THREE.Texture( <Image> ),
      *
      *  displacementMap: new THREE.Texture( <Image> ),
      *  displacementScale: <float>,
      *  displacementBias: <float>,
      *
      *  wireframe: <boolean>,
      *  wireframeLinewidth: <float>
      */
      material_options: [{color: 0xAAAA00}]
    },

    {
      name:             "Mesh Lambert Material",
      description:      "Mesh Lambert Material",
      material:         "MeshLambertMaterial",
      /*
      *  color: <hex>,
      *  opacity: <float>,
      *
      *  map: new THREE.Texture( <Image> ),
      *
      *  lightMap: new THREE.Texture( <Image> ),
      *  lightMapIntensity: <float>
      *
      *  aoMap: new THREE.Texture( <Image> ),
      *  aoMapIntensity: <float>
      *
      *  emissive: <hex>,
      *  emissiveIntensity: <float>
      *  emissiveMap: new THREE.Texture( <Image> ),
      *
      *  specularMap: new THREE.Texture( <Image> ),
      *
      *  alphaMap: new THREE.Texture( <Image> ),
      *
      *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
      *  combine: THREE.Multiply,
      *  reflectivity: <float>,
      *  refractionRatio: <float>,
      *
      *  wireframe: <boolean>,
      *  wireframeLinewidth: <float>,
      *
      *  skinning: <bool>,
      *  morphTargets: <bool>,
      *  morphNormals: <bool>
      */
      material_options: [{color: 0xAAAA00}]
    },

    {
      name:             "Mesh Normal Material",
      description:      "Mesh Normal Material",
      material:         "MeshNormalMaterial",
      /*
      *  opacity: <float>,
      *
      *  bumpMap: new THREE.Texture( <Image> ),
      *  bumpScale: <float>,
      *
      *  normalMap: new THREE.Texture( <Image> ),
      *  normalScale: <Vector2>,
      *
      *  displacementMap: new THREE.Texture( <Image> ),
      *  displacementScale: <float>,
      *  displacementBias: <float>,
      *
      *  wireframe: <boolean>,
      *  wireframeLinewidth: <float>
      *
      *  skinning: <bool>,
      *  morphTargets: <bool>,
      *  morphNormals: <bool>
      */
      material_options: [{color: 0xAAAA00}]
    },

    {
      name:             "Mesh Toon Material",
      description:      "Mesh Toon Material",
      material:         "MeshToonMaterial",
      /*
      *  gradientMap: new THREE.Texture( <Image> )
      */
      material_options: [{}]
    },

    {
      name:             "Mesh Phong Material",
      description:      "Mesh Phong Material",
      material:         "MeshPhongMaterial",
      /*
      *  color: <hex>,
      *  specular: <hex>,
      *  shininess: <float>,
      *  opacity: <float>,
      *
      *  map: new THREE.Texture( <Image> ),
      *
      *  lightMap: new THREE.Texture( <Image> ),
      *  lightMapIntensity: <float>
      *
      *  aoMap: new THREE.Texture( <Image> ),
      *  aoMapIntensity: <float>
      *
      *  emissive: <hex>,
      *  emissiveIntensity: <float>
      *  emissiveMap: new THREE.Texture( <Image> ),
      *
      *  bumpMap: new THREE.Texture( <Image> ),
      *  bumpScale: <float>,
      *
      *  normalMap: new THREE.Texture( <Image> ),
      *  normalScale: <Vector2>,
      *
      *  displacementMap: new THREE.Texture( <Image> ),
      *  displacementScale: <float>,
      *  displacementBias: <float>,
      *
      *  specularMap: new THREE.Texture( <Image> ),
      *
      *  alphaMap: new THREE.Texture( <Image> ),
      *
      *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
      *  combine: THREE.Multiply,
      *  reflectivity: <float>,
      *  refractionRatio: <float>,
      *
      *  wireframe: <boolean>,
      *  wireframeLinewidth: <float>,
      *
      *  skinning: <bool>,
      *  morphTargets: <bool>,
      *  morphNormals: <bool>
      */
      material_options: [{color: 0xAAAA00}]
    },

    {
      name:             "Mesh Standard Material",
      description:      "Mesh Standard Material",
      material:         "MeshStandardMaterial",
      /*
      *  color: <hex>,
      *  roughness: <float>,
      *  metalness: <float>,
      *  opacity: <float>,
      *
      *  map: new THREE.Texture( <Image> ),
      *
      *  lightMap: new THREE.Texture( <Image> ),
      *  lightMapIntensity: <float>
      *
      *  aoMap: new THREE.Texture( <Image> ),
      *  aoMapIntensity: <float>
      *
      *  emissive: <hex>,
      *  emissiveIntensity: <float>
      *  emissiveMap: new THREE.Texture( <Image> ),
      *
      *  bumpMap: new THREE.Texture( <Image> ),
      *  bumpScale: <float>,
      *
      *  normalMap: new THREE.Texture( <Image> ),
      *  normalScale: <Vector2>,
      *
      *  displacementMap: new THREE.Texture( <Image> ),
      *  displacementScale: <float>,
      *  displacementBias: <float>,
      *
      *  roughnessMap: new THREE.Texture( <Image> ),
      *
      *  metalnessMap: new THREE.Texture( <Image> ),
      *
      *  alphaMap: new THREE.Texture( <Image> ),
      *
      *  envMap: new THREE.CubeTexture( [posx, negx, posy, negy, posz, negz] ),
      *  envMapIntensity: <float>
      *
      *  refractionRatio: <float>,
      *
      *  wireframe: <boolean>,
      *  wireframeLinewidth: <float>,
      *
      *  skinning: <bool>,
      *  morphTargets: <bool>,
      *  morphNormals: <bool>
      */
      material_options: [{color: 0xAAAAAA}]
    },

    {
      name:             "Mesh Physical Material",
      description:      "Mesh Physical Material",
      material:         "MeshPhysicalMaterial",
      /*
      *  reflectivity: <float>
      */
      material_options: [{}]
    }

    // TODO: more materials


  ]);
}