export { default as OrbitsRenderer     } from "./lib/OrbitsRenderer.jsx";
export { useRenderer                   } from "./lib/OrbitsRenderer.jsx";

export { default as OrbitsScene        } from "./lib/OrbitsScene.jsx";
export { useScene                      } from "./lib/OrbitsScene.jsx";

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
export { default as BoxGeometry  }       from "./lib/geometries/BoxGeometry.jsx";

// Materials exports
export { default as MeshBasicMaterial  } from "./lib/materials/MeshBasicMaterial.jsx";


// Objects exports
export { default as Mesh }       from "./lib/objects/Mesh.jsx";
export { default as MeshLoader } from "./lib/objects/MeshLoader.jsx";

export { default as Points }       from "./lib/geometries/Points.jsx";
export { default as Line }         from "./lib/geometries/Line.jsx";
export { default as LineSegments } from "./lib/geometries/LineSegments.jsx";
export { default as Triangles }    from "./lib/geometries/Triangles.jsx";


export { default as Box  }         from "./lib/geometries/Box.jsx"; // ??

export { default as Group  }       from "./lib/Group.jsx";


console.groupCollapsed('%c Orbits TODOS! ', 'color: orange; font-size: 24px;');
    
    console.error("!!! Check redispatch last mousemove for issues !!!");

    console.error("TODO: Implement Apply material props on hover (with transition)");
    console.error("Implement scene overlay");
    console.error("Implement Timer");
    console.error("Implement period={{diration: 1.4325, rotation: [0, Math.PI], ...}}");
    console.error("Implement transition={{diration: 1.4325, rotation: [0, Math.PI], ...}}");

    console.error("Read about THREE.BatchedMesh, THREE.InstancedMesh, THREE.SkinnedMesh" );
    console.error("Read about Material.depthFunc, Material.depthTest, Material.depthWrite" );

console.groupEnd("Orbits TODOS")