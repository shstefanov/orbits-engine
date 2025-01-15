import React, { useState, useEffect, createContext, useContext, useMemo } from "react";
import * as THREE                  from "three";
import { useScene, SceneProvider } from "../OrbitsScene.jsx";

import createMeshManager from "../utils/createMeshManager.js";

const meshDefaultMaterial = new THREE.MeshBasicMaterial();

const meshContext = createContext();
export const MeshProvider = meshContext.Provider;
export const useMesh = () => useContext(meshContext);

function skip(){};

export default function Mesh(props){
    
    const scene = useScene();
    
    const [ mesh,     setMesh     ] = useState(null);
    const [ material, setMaterial ] = useState(props.material);
    const [ geometry, setGeometry ] = useState(props.geometry);
    
    const [ meshManager, setMeshManager ] = useState(createMeshManager(null, props, mesh));

    const collectContext = useMemo( () => ({
        setGeometry: props.hasOwnProperty("geometry") ? skip : setGeometry,
        setMaterial: props.hasOwnProperty("material") ? skip : setMaterial,
        tmp: true
    }), []);

    // Creating the mesh here
    useEffect(() => {

        
        console.log("Initialize mesh::", props.id, {geometry, material});

        if(!geometry || !material) return;
        // if(mesh) return;

        const newMesh = new THREE.Mesh( geometry, material );

        newMesh.render = scene.render; // Pass render trough the hierarchy
        newMesh.addAnimated    = scene.addAnimated;
        newMesh.removeAnimated = scene.removeAnimated;

        if(props.id) newMesh.name = props.id;

        scene.add(newMesh);


        setMesh(newMesh);

        props.onCreate && props.onCreate(newMesh);

        scene.render();

        if(meshManager){
            const meshManager = createMeshManager(newMesh, props);
            meshManager.set(props);
            setMeshManager( meshManager );
        }



        return () => {
            scene.remove(mesh);
            scene.render();
        }

    }, [geometry, material]);

    meshManager && meshManager.set(props, useEffect);

    return <SceneProvider value={mesh}>
        { (!mesh && Array.isArray(props.children))  && <MeshProvider value={collectContext}> { props.children.filter( c => c?.type?.isMeshComponent)  } </MeshProvider> }
        { (!mesh && !Array.isArray(props.children)) && <MeshProvider value={collectContext}> { props.children?.type.isMeshComponent && props.children } </MeshProvider> }
        {   mesh                                    && <MeshProvider value={collectContext}> { props.children }                                         </MeshProvider> }
    </SceneProvider>;
}