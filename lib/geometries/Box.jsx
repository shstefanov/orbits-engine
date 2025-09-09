import React, { useState, useEffect } from "react";
import * as THREE                     from "three";
import { useScene, SceneProvider }    from "../OrbitsScene.jsx";
import { useRenderer }                from "../OrbitsRenderer.jsx";

import createMeshManager from "../utils/createMeshManager.js";

const boxDefaultMaterial = new THREE.MeshBasicMaterial();

export default function Box(props){

    const renderer = useRenderer();
    const scene = useScene();
    
    const [ mesh,     setMesh     ] = useState(null);
    const [ material, setMaterial ] = useState(null);
    const [ geometry, setGeometry ] = useState(null);
    
    const [ transformManager, setTransformManager ] = useState(createMeshManager(null, props, renderer, mesh));
    // Creating the mesh here
    useEffect(() => {
        
        const geometry = new THREE.BoxGeometry( ...( props.size || [] ) );
        const material = (props.material || boxDefaultMaterial).clone();
        const mesh     = new THREE.Mesh( geometry, material );

        if(props.id) mesh.name = props.id;

        scene.add(mesh);
        renderer.render();

        setMesh(mesh);
        setMaterial(material);
        setGeometry(geometry);

        if(transformManager){
            const manager = createMeshManager(mesh, props, renderer);
            manager.set(props);
            setTransformManager( manager );
        }


        return () => {
            scene.remove(mesh);
            renderer.render();
        }

    }, []);

    transformManager && transformManager.set(props, useEffect);

    return <SceneProvider value={mesh}>
        { mesh && props.children }
    </SceneProvider>;
}