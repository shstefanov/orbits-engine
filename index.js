import * as Materials from "./lib/materials/Materials.jsx";
for(let matName in Materials) Materials[matName].isMeshComponent = true;

import * as Geometries from "./lib/geometries/Geometries.jsx";
for(let geoName in Geometries) Geometries[geoName].isMeshComponent = true;


export { default as OrbitsRenderer     } from "./lib/OrbitsRenderer.jsx";
export { useRenderer                   } from "./lib/OrbitsRenderer.jsx";

export { default as OrbitsScene        } from "./lib/OrbitsScene.jsx";
export { useScene                      } from "./lib/OrbitsScene.jsx";

export { default as Timer              } from "./lib/Timer.jsx";
export { useTimer                      } from "./lib/Timer.jsx";

// Cameras exports
export { default as ArrayCamera        } from "./lib/cameras/ArrayCamera.jsx";
export { default as CubeCamera         } from "./lib/cameras/CubeCamera.jsx";
export { default as OrthographicCamera } from "./lib/cameras/OrthographicCamera.jsx";
export { default as PerspectiveCamera  } from "./lib/cameras/PerspectiveCamera.jsx";
export { default as StereoCamera       } from "./lib/cameras/StereoCamera.jsx";
export { default as useCamera          } from "./lib/cameras/useCamera.jsx";

// Lights exports
export { default as AmbientLight       } from "./lib/lights/AmbientLight.jsx";
export { default as DirectionalLight   } from "./lib/lights/DirectionalLight.jsx";
export { default as PointLight         } from "./lib/lights/PointLight.jsx";
export { default as SpotLight          } from "./lib/lights/SpotLight.jsx";
export { default as HemisphereLight    } from "./lib/lights/HemisphereLight.jsx";
export { default as RectAreaLight      } from "./lib/lights/RectAreaLight.jsx";
export { default as LightProbe         } from "./lib/lights/LightProbe.jsx";



// Geometries exports
// export { default as BoxGeometry        } from "./lib/geometries/BoxGeometry.jsx";

// Materials exports
export { default as Material           } from "./lib/materials/Material.jsx";
export *                                 from "./lib/materials/Materials.jsx";
export *                                 from "./lib/geometries/Geometries.jsx";


// Objects exports
export { default as Mesh }       from "./lib/objects/Mesh.jsx";
export { default as MeshLoader } from "./lib/objects/MeshLoader.jsx";

export { default as Points }         from "./lib/geometries/Points.jsx";
export { default as Line }           from "./lib/geometries/Line.jsx";
export { default as LineSegments }   from "./lib/geometries/LineSegments.jsx";
export { default as Sprite }         from "./lib/geometries/Sprite.jsx";
export { default as Triangles }      from "./lib/geometries/Triangles.jsx";
export { default as BufferGeometry } from "./lib/geometries/BufferGeometry.jsx";


export { default as Box  }         from "./lib/geometries/Box.jsx"; // ??

export { default as Group  }       from "./lib/Group.jsx";


console.groupCollapsed('%c Orbits TODOS! ', 'color: orange; font-size: 24px;');

    console.error("Implement 'title' attribute")
    console.error("Inspect if line 32 of createMeshManager is correct");
    console.error("Implelent custom curve type for ExtrudeGeometry and TubeGeometry like: https://threejs.org/docs/#api/en/geometries/TubeGeometry");
    console.error("Read about THREE.BatchedMesh, THREE.InstancedMesh, THREE.SkinnedMesh" );
    console.error("Read about https://threejs.org/examples/#webgl_postprocessing_outline");
    console.error("Implement audio");
    console.error("Read about SVGLoader: https://threejs.org/docs/#examples/en/loaders/SVGLoader");
    console.error("Add option to renderer to set: THREE.Object3D.DEFAULT_UP.set( 0, 0, 1 ); ???");
    console.error("Think about 'Surface' class, which just like 'THREE.Curve' must have surface.getPoint( x, y )");

console.groupEnd("Orbits TODOS")