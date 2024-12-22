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
    const [ cameraManager, setCameraManager ] = useState(createCameraManager(null, props, renderer.domElement, camera));

    useEffect(() => {
        const { width, height } = renderer.actualSize;

        // TODO - set some default value, we can have undefined for some of them
        const camera = new THREE.PerspectiveCamera( props.fov, props.aspect || (width / height), props.near, props.far );
        scene.camera = camera;
        camera.render = scene.render;
        scene.add(camera);

        // If there is no props.aspect, means it will be autocomputed from viewport size
        let resizeListener;
        if(!props.hasOwnProperty("aspect")){
            renderer.addResizeListener(resizeListener = (width, height) => {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            });
        }

        console.log({renderer});
        setCameraManager( createCameraManager(camera, props, renderer.domElement) );

        setCamera(camera);
        scene.render();

        return () => {
            delete scene.camera;
            resizeListener && renderer.removeResizeListener(resizeListener);
            scene.remove(camera);
            scene.render();
        }

    }, []);

    cameraManager && cameraManager.set(props);

    return <SceneProvider value={camera}>
        { camera && props.children }
    </SceneProvider>;
}

