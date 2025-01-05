import React, { useState, useEffect } from "react";
import * as THREE                  from "three";
import { useScene, SceneProvider } from "../OrbitsScene.jsx";

import createTransformManager from "../utils/createMeshManager.js";

const boxDefaultMaterial = new THREE.MeshBasicMaterial();

export default function Box(props){
    
    const scene = useScene();
    
    const [ mesh,     setMesh     ] = useState(null);
    const [ material, setMaterial ] = useState(null);
    const [ geometry, setGeometry ] = useState(null);
    
    const [ transformManager, setTransformManager ] = useState(createTransformManager(null, props, mesh));
    // Creating the mesh here
    useEffect(() => {
        
        const geometry = new THREE.BoxGeometry( ...( props.size || [] ) );
        const material = (props.material || boxDefaultMaterial).clone();
        const mesh     = new THREE.Mesh( geometry, material );

        mesh.render = scene.render; // Pass render trough the hierarchy

        if(props.id) mesh.name = props.id;

        scene.add(mesh);
        scene.render();

        setMesh(mesh);
        setMaterial(material);
        setGeometry(geometry);

        const manager = createTransformManager(mesh, props);
        manager.set(props);
        setTransformManager( manager );

        return () => {
            scene.remove(mesh);
            scene.render();
        }

    }, []);

    transformManager && transformManager.set(props, useEffect);

    return <SceneProvider value={mesh}>
        { mesh && props.children }
    </SceneProvider>;
}