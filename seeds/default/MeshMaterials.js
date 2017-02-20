
module.exports = function(cb){
  cb(null, [

    /*
      Line Materials
    */

    {
      name:             "Basic Line Material",
      description:      "Basic Line Material",
      json: {
        "type": "LineBasicMaterial",
        "color": 11184810,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true
      }

      /*
      *  color: <hex>,
      *  opacity: <float>,
      *
      *  linewidth: <float>,
      *  linecap: "round",
      *  linejoin: "round"
      */
      // material:         "LineBasicMaterial",
      // material_options: [{color: 0xAAAAAA }]
    },

    
    {
      name:             "Dashed Line Material",
      description:      "Dashed Line Material",
      json: {
        "type": "LineDashedMaterial",
        "color": 11184810,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true
      },

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
      // material:         "LineDashedMaterial",
      // material_options: [{color: 0xAAAAAA }]
    },






    {
      name:             "Basic Mesh Material",
      description:      "Basic Mesh Material",
      json: {
        "type": "MeshBasicMaterial",
        "color": 11184810,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "skinning": false,
        "morphTargets": false
      },


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
      // material:         "MeshBasicMaterial",
      // material_options: [{color: 0xAAAAAA }]
    },

    {
      name:             "Mesh Depth Material",
      description:      "Mesh Depth Material",

      json: {
        "type": "MeshDepthMaterial",
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "skinning": false,
        "morphTargets": false
      },

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
      // material:         "MeshDepthMaterial",
      // material_options: [{}]
    },

    {
      name:             "Mesh Lambert Material",
      description:      "Mesh Lambert Material",
      json: {
        "type": "MeshLambertMaterial",
        "color": 11184640,
        "emissive": 0,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "skinning": false,
        "morphTargets": false
      },

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
      // material:         "MeshLambertMaterial",
      // material_options: [{color: 0xAAAA00}]
    },

    {
      name:             "Mesh Normal Material",
      description:      "Mesh Normal Material",
      json: {
        "type": "MeshNormalMaterial",
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "skinning": false,
        "morphTargets": false
      },
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
      // material:         "MeshNormalMaterial",
      // material_options: [{}]
    },

    {
      name:             "Mesh Toon Material",
      description:      "Mesh Toon Material",
      json: {
        "type": "MeshToonMaterial",
        "color": 16777215,
        "emissive": 0,
        "specular": 1118481,
        "shininess": 30,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "skinning": false,
        "morphTargets": false
      },

      // gradientMap: new THREE.Texture( <Image> )

      // material:         "MeshToonMaterial",
      // material_options: [{}]
    },

    {
      name:             "Mesh Phong Material",
      description:      "Mesh Phong Material",
      json: {
        "type": "MeshPhongMaterial",
        "color": 11184640,
        "emissive": 0,
        "specular": 1118481,
        "shininess": 30,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "skinning": false,
        "morphTargets": false
      }
      // material:         "MeshPhongMaterial",
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
      // material_options: [{color: 0xAAAA00}]
    },

    {
      name:             "Mesh Standard Material",
      description:      "Mesh Standard Material",
      json: {
        "type": "MeshStandardMaterial",
        "color": 11184810,
        "roughness": 0.5,
        "metalness": 0.5,
        "emissive": 0,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "skinning": false,
        "morphTargets": false
      },
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
      // material:         "MeshStandardMaterial",
      // material_options: [{color: 0xAAAAAA}]
    },

    {
      name:             "Mesh Physical Material",
      description:      "Mesh Physical Material",
      json: {
        "type": "MeshPhysicalMaterial",
        "color": 16777215,
        "roughness": 0.5,
        "metalness": 0.5,
        "emissive": 0,
        "clearCoat": 0,
        "clearCoatRoughness": 0,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "skinning": false,
        "morphTargets": false
      },


      //  reflectivity: <float>

      // material:         "MeshPhysicalMaterial",
      // material_options: [{}]
    }

    // TODO: more materials


  ]);
}