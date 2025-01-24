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

    if(mesh) mesh.userData = props;
    
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

        if(props.id) mesh.name = props.id;
        if(!props.nonInteractive) renderer.addMouseInteractiveObject(mesh);
        scene.add(mesh);
        setMesh(mesh);
        props.onCreate && props.onCreate(mesh);
        renderer.render();
        const meshManager  = createMeshManager(mesh, props, renderer);
        meshManager.set(props);
        setMeshManager( meshManager );

        return () => {
            scene.remove(mesh);
            renderer.render();
            // eventManager.dispose();
            props.onDestroy && props.onDestroy(mesh);
            if(!props.nonInteractive) renderer.removeMouseInteractiveObject(mesh);
        }

    }, [geometry, material]);

    meshManager.set(props, useEffect);

    return <SceneProvider value={mesh}>
        { (!mesh && Array.isArray(props.children))  && <MeshProvider value={collectContext}> { props.children.filter( c => c?.type?.isMeshComponent)  } </MeshProvider> }
        { (!mesh && !Array.isArray(props.children)) && <MeshProvider value={collectContext}> { props.children?.type.isMeshComponent && props.children } </MeshProvider> }
        {   mesh                                    && <MeshProvider value={collectContext}> { props.children }                                         </MeshProvider> }
    </SceneProvider>;
}