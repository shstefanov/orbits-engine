import React, { useState, useEffect, createContext, useContext, useMemo } from "react";
import * as THREE                  from "three";
import { useScene, SceneProvider } from "../OrbitsScene.jsx";
import { useRenderer }             from "../OrbitsRenderer.jsx";
import createMeshManager           from "../utils/createMeshManager.js";

const meshContext = createContext();
export const MeshProvider = meshContext.Provider;
export const useMesh = () => useContext(meshContext);

function skip(){};

export default function Mesh(props){
    
    const renderer = useRenderer();
    const scene    = useScene();
    
    const [ mesh,     setMesh     ] = useState(null);
    const [ material, setMaterial ] = useState(props.material);
    const [ geometry, setGeometry ] = useState(props.geometry);
    const [ showHoverElement, setShowHoverElement ] = useState(false);
    

    if(mesh) {
        const { children, ...pr } = props;
        mesh.userData = pr;
        mesh.setShowHoverElement = setShowHoverElement;
    }
    
    const [ meshManager,  setMeshManager  ] = useState(createMeshManager  (null, props, renderer, mesh));

    const collectContext = useMemo( () => ({
        setGeometry: props.hasOwnProperty("geometry") ? skip : setGeometry,
        setMaterial: props.hasOwnProperty("material") ? skip : setMaterial,
        tmp: true
    }), []);

    // Creating the mesh here
    useEffect(() => {
        if(!props.mesh) {
            if(!geometry || !material) return;
        }

        const mesh = props.mesh || new ( props.MeshPrototype || THREE.Mesh )(geometry, material);

        mesh.animations = [];

        if(props.id) mesh.name = props.id;

        const meshManager = createMeshManager(mesh, props, renderer);

        scene.add(mesh);
        props.onCreate && props.onCreate(mesh);


        setMesh(mesh);
        renderer.render();

        
        setMeshManager( meshManager );

        return () => {
            scene.remove(mesh);
            renderer.render();
            props.onDestroy && props.onDestroy(mesh);
            if(props.hasOwnProperty("interactive")) renderer.removeMouseInteractiveObject(mesh);
        }

    }, [geometry, material]);

    meshManager.set(props, useEffect);

    return <SceneProvider value={mesh}>
        {   
            // When geometry, material or both are managed by child component, we need them to be created
            // first and provided trough collectContext
            !mesh
                ? <MeshProvider value={collectContext}> { onlyComponents(props.children)  } </MeshProvider>
                : <MeshProvider value={collectContext}> { props.children }                  </MeshProvider>
        }
        { mesh && showHoverElement && props.hover }
    </SceneProvider>;
}

// This returns only components that are required for mesh
function onlyComponents(children){
    if(Array.isArray(children)) return children.filter( c => c?.type?.isMeshComponent );
    else if(typeof children === "object" && children?.type.isMeshComponent) return children;
    else return null;
}