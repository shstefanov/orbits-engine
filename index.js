import * as Materials from "./lib/materials/Materials.jsx";
for(let matName in Materials) Materials[matName].isMeshComponent = true;

import * as Geometries from "./lib/geometries/Geometries.jsx";
for(let geoName in Geometries) Geometries[geoName].isMeshComponent = true;


export { default as OrbitsRenderer      } from "./lib/OrbitsRenderer.jsx";
export { useRenderer                    } from "./lib/OrbitsRenderer.jsx";

export { default as OrbitsScene         } from "./lib/OrbitsScene.jsx";
export { useScene                       } from "./lib/OrbitsScene.jsx";

export { default as Timer               } from "./lib/Timer.jsx";
export { useTimer                       } from "./lib/Timer.jsx";

// Cameras exports
export { default as ArrayCamera         } from "./lib/cameras/ArrayCamera.jsx";
export { default as CubeCamera          } from "./lib/cameras/CubeCamera.jsx";
export { default as OrthographicCamera  } from "./lib/cameras/OrthographicCamera.jsx";
export { default as PerspectiveCamera   } from "./lib/cameras/PerspectiveCamera.jsx";
export { default as StereoCamera        } from "./lib/cameras/StereoCamera.jsx";
export { default as useCamera           } from "./lib/cameras/useCamera.jsx";

// Lights exports
export { default as AmbientLight        } from "./lib/lights/AmbientLight.jsx";
export { default as DirectionalLight    } from "./lib/lights/DirectionalLight.jsx";
export { default as PointLight          } from "./lib/lights/PointLight.jsx";
export { default as SpotLight           } from "./lib/lights/SpotLight.jsx";
export { default as HemisphereLight     } from "./lib/lights/HemisphereLight.jsx";
export { default as RectAreaLight       } from "./lib/lights/RectAreaLight.jsx";
export { default as LightProbe          } from "./lib/lights/LightProbe.jsx";



// Geometries exports
// export { default as BoxGeometry        } from "./lib/geometries/BoxGeometry.jsx";

// Materials exports
export { default as Material           } from "./lib/materials/Material.jsx";
export *                                from "./lib/materials/Materials.jsx";
export *                                from "./lib/geometries/Geometries.jsx";


// Objects exports
export { default as Mesh               } from "./lib/objects/Mesh.jsx";
export { default as InstancedMesh      } from "./lib/objects/InstancedMesh.jsx";
export { useInstanceBuffer as useInstanceBuffer  } from "./lib/objects/InstancedMesh.jsx";
export { default as BatchedMesh        } from "./lib/objects/BatchedMesh.jsx";
export { default as SkinnedMesh        } from "./lib/objects/SkinnedMesh.jsx";
export { default as MeshLoader         } from "./lib/objects/MeshLoader.jsx";
export { default as Audio, AudioEffect, PositionalAudio } from "./lib/objects/Audio.jsx";

export { default as Points             } from "./lib/geometries/Points.jsx";
export { default as Line               } from "./lib/geometries/Line.jsx";
export { default as LineSegments       } from "./lib/geometries/LineSegments.jsx";
export { default as Sprite             } from "./lib/geometries/Sprite.jsx";
export { default as Triangles          } from "./lib/geometries/Triangles.jsx";
export { default as BufferGeometry     } from "./lib/geometries/BufferGeometry.jsx";


export { default as Box  }         from "./lib/geometries/Box.jsx"; // ??

export { default as Group  }       from "./lib/Group.jsx";

// console.groupCollapsed('%c Orbits TODOS! ', 'color: orange; font-size: 24px;');

    
//     console.error("Must have: Integrate HTML drag and drop woth OrbitsRenderer drag and drop (and vice versa if possible)");
    

//     console.error("Issue: Check if event.camera is available in all mouse events");
//     console.error("Issue: For components that handle loading assets - change src trigger new loading, but old one still loads and will apply, fix it!");
//     console.error("Issue (leak): Make audio buffer cache map attached to renderer, not to variable");

//     console.error("Util: Consider Tone.js: If you need more advanced audio manipulation, you might explore using Tone.js in conjunction with Three.js, as it offers a more robust set of tools for audio synthesis and spatialization.");
//     console.error("Util: Create asset preloader element, it must block children (or render loading message while loading)");
//     console.error("Util: Read about SVGLoader: https://threejs.org/docs/#examples/en/loaders/SVGLoader");
//     console.error("Util: Implelent custom curve type for ExtrudeGeometry and TubeGeometry like: https://threejs.org/docs/#api/en/geometries/TubeGeometry");
//     console.error("Util: Read about https://threejs.org/examples/#webgl_postprocessing_outline");
//     console.error("Util: Think about 'Surface' class, which just like 'THREE.Curve' must have surface.getPoint( x, y )");

// console.groupEnd("Orbits TODOS")