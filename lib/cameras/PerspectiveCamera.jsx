import React, { useEffect, useState, createContext } from "react";
import * as THREE from "three";
import { useRenderer } from "../OrbitsRenderer.jsx";
import { SceneProvider, useScene } from "../OrbitsScene.jsx";
import createCameraManager from "../utils/createCameraManager.js";


export function useCamera( scene = useScene() ){
    return scene?.camera || ( scene.patent && useCamera(scene.parent) );
}

export default function PerspectiveCamera(props){

    const renderer = useRenderer();
    const scene    = useScene();

    const [ camera,        setCamera        ] = useState(null);
    const [ cameraManager, setCameraManager ] = useState(createCameraManager(null, props, renderer, camera));

    useEffect(() => {
        const { width, height } = renderer.getSize();

        // TODO - set some default value, we can have undefined for some of them
        const camera = new THREE.PerspectiveCamera( props.fov, props.aspect || (width / height), props.near, props.far );
        
        if(props.hasOwnProperty("viewport")) {
            camera.viewport = props.viewport;
            camera.updateMatrixWorld();
        }
        
        scene.camera = camera;
        scene.add(camera);

        // If there is no props.aspect, means it will be autocomputed from viewport size
        let resizeListener;
        if(!props.hasOwnProperty("aspect")){
            renderer.addResizeListener(resizeListener = (size) => {
                camera.aspect = size.width / size.height;
                camera.updateProjectionMatrix();
            });
        }

        setCameraManager( createCameraManager(camera, props, renderer) );

        setCamera(camera);
        renderer.render();

        return () => {
            delete scene.camera;
            resizeListener && renderer.removeResizeListener(resizeListener);
            scene.remove(camera);
            renderer.render();
        }

    }, []);

    cameraManager.set(props, useEffect);

    return <SceneProvider value={camera}>
        { camera && props.children }
    </SceneProvider>;
}

