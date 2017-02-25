
module.exports = function(cb){
  cb(null, [

    {
      name:             "Box",
      description:      "Box Geometry",
      geometry:         "BoxGeometry",

      //  ( width, height, depth, widthSegments, heightSegments, depthSegments )

      geometry_options: [ 1, 1, 1 ]
    },

    {
      name:             "Circle",
      description:      "Circle Geometry",
      geometry:         "CircleGeometry",

      //  ( radius, segments, thetaStart, thetaLength )

      geometry_options: [ 1, 10 ]
    },

    {
      name:             "Cone",
      description:      "Cone Geometry",
      geometry:         "ConeGeometry",

      //  ( radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength )

      geometry_options: [ 1, 1, 10 ]
    },

    {
      name:             "Cylinder",
      description:      "Cylinder Geometry",
      geometry:         "CylinderGeometry",

      //  ( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength )

      geometry_options: [ 1, 1, 2 ]
    },

    {
      name:             "Dodecahedron",
      description:      "Dodecahedron Geometry",
      geometry:         "DodecahedronGeometry",

      //  ( radius, detail )

      geometry_options: [ 2, 2 ]
    },

    {
      name:             "Icosahedron",
      description:      "Icosahedron Geometry",
      geometry:         "IcosahedronGeometry",

      //  ( radius, detail )

      geometry_options: [ 2, 2 ]
    },

    {
      name:             "Lathe (TODO)",
      description:      "Lathe Geometry",
      geometry:         "LatheGeometry",

      //  ( points, segments, phiStart, phiLength )

      geometry_options: [ [ [0, 0, 0], [1,1,1], [1,2,3]  ] , 10 ]
    },

    {
      name:             "Octahedron",
      description:      "Octahedron Geometry",
      geometry:         "OctahedronGeometry",

      //  ( radius ,detail )

      geometry_options: [ 1, 1 ]
    },

    {
      name:             "Plane",
      description:      "Plane Geometry",
      geometry:         "PlaneGeometry",

      //  ( width, height, widthSegments, heightSegments )

      geometry_options: [ 1, 1 ]
    },

    // {
    //   name:             "Polyhedron Geometry",
    //   description:      "Polyhedron Geometry",
    //   geometry:         "PolyhedronGeometry",

    //   //  ( vertices, indices, radius, detail )

    //   geometry_options: [ [] ]
    // },

    {
      name:             "Ring",
      description:      "Ring Geometry",
      geometry:         "RingGeometry",

      //  (  innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength )

      geometry_options: [ 1, 2, 10, 10 ]
    },

    {
      name:             "Shape (TODO)",
      description:      "Shape Geometry",
      geometry:         "ShapeGeometry",

      //  ( shapes, curveSegments )

      geometry_options: [ [] ]
    },

    {
      name:             "Sphere",
      description:      "Sphere Geometry",
      geometry:         "SphereGeometry",

      //  (  radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength )

      geometry_options: [ 2, 10, 10 ]
    },

    {
      name:             "Tetrahedron",
      description:      "Tetrahedron Geometry",
      geometry:         "TetrahedronGeometry",

      //  (  radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength )

      geometry_options: [ 2, 2 ]
    },

    // {
    //   name:             "Text Geometry",
    //   description:      "Text Geometry",
    //   geometry:         "TextGeometry",
      /*
        ( text, parameters )
      */
      /*
      *  font: <THREE.Font>, // font
      *
      *  size: <float>, // size of the text
      *  height: <float>, // thickness to extrude text
      *  curveSegments: <int>, // number of points on the curves
      *
      *  bevelEnabled: <bool>, // turn on bevel
      *  bevelThickness: <float>, // how deep into text bevel goes
      *  bevelSize: <float> // how far from text outline is bevel
      */

    //   geometry_options: [ "Text", { size: 1 } ]
    // },

    {
      name:             "Torus",
      description:      "Torus Geometry",
      geometry:         "TorusGeometry",

      // ( radius, tube, radialSegments, tubularSegments, arc )

      geometry_options: [ 2, 2 ]
    },

    {
      name:             "Torus Knot",
      description:      "Torus Knot Geometry",
      geometry:         "TorusKnotGeometry",

      // ( radius, tube, tubularSegments, radialSegments, p, q, heightScale )

      geometry_options: [ 2, 2 ]
    },

    // {
    //   name:             "Tube Geometry",
    //   description:      "Tube Geometry",
    //   geometry:         "TubeGeometry",

    //   // ( path, tubularSegments, radius, radialSegments, closed, taper )

    //   geometry_options: [ [ [1,1,1], [2,2,2], [0,0,0] ], 10 ]
    // },

    // TODO
    // {
    //   name:             "Wireframe Geometry",
    //   description:      "Wireframe Geometry",
    //   geometry:         "WireframeGeometry",

    //   // ( path, tubularSegments, radius, radialSegments, closed, taper )

    //   geometry_options: [ [ [1,1,1], [2,2,2], [0,0,0] ], 10 ]
    // },





    // {
    //   name:             "Parametric Buffer Geometry",
    //   description:      "Parametric Buffer Geometry",
    //   geometry:         "ParametricBufferGeometry",
    //   //   ( func, slices, stacks )
    //   geometry_options: []
    // },

    // {
    //   name:             "Parametric Geometry",
    //   description:      "Parametric Geometry",
    //   geometry:         "ParametricGeometry",
    //   //   ( func, slices, stacks )
    //   geometry_options: []
    // },



    // TODO :: research
    // {
    //   name:             "Edges Geometry",
    //   description:      "Edges Geometry",
    //   geometry:         "EdgesGeometry",
    //   /*
    //     ( geometry, thresholdAngle  )
    //   */
    //   geometry_options: [ 1, 10 ]
    // },

    // TODO :: research
    // {
    //   name:             "Extrude Geometry",
    //   description:      "Extrude Geometry",
    //   geometry:         "ExtrudeGeometry",
      /*
        ( shapes, options )
         *  curveSegments: <int>, // number of points on the curves
         *  steps: <int>, // number of points for z-side extrusions / used for subdividing segments of extrude spline too
         *  amount: <int>, // Depth to extrude the shape
         *
         *  bevelEnabled: <bool>, // turn on bevel
         *  bevelThickness: <float>, // how deep into the original shape bevel goes
         *  bevelSize: <float>, // how far from shape outline is bevel
         *  bevelSegments: <int>, // number of bevel layers
         *
         *  extrudePath: <THREE.Curve> // curve to extrude shape along
         *  frames: <Object> // containing arrays of tangents, normals, binormals
         *
         *  uvGenerator: <Object> // object that provides UV generator functions
      */
    //   geometry_options: [ 1, 10 ]
    // },





    // {
    //   name:             "SimpleCubeGeometry",
    //   geometry:         "CubeGeometry",
    //   geometry_options: [ 1, 1, 1 ]
    // }
  ]);
};
