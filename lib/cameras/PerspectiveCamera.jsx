import React, { useEffect, useState, createContext } from "react";
import * as THREE from "three";
import { useRenderer } from "../OrbitsRenderer.jsx";
import { SceneProvider, useScene } from "../OrbitsScene.jsx";
import createCameraManager from "../utils/createCameraManager.js";
import createCameraSettingsManager from "../utils/createCameraSettingsManager.js";

export function useCamera( scene = useScene() ){
    return scene?.camera || ( scene.patent && useCamera(scene.parent) );
}

export default function PerspectiveCamera(props){

    const renderer = useRenderer();
    const scene    = useScene();

    const [ camera, setCamera ] = useState(null);

    const [ cameraManager,         setCameraManager         ] = useState(createCameraManager(null, props, camera));
    const [ cameraSettingsManager, setCameraSettingsManager ] = useState(createCameraSettingsManager(null, props, camera));

    useEffect(() => {
        const { width, height } = renderer.actualSize;

        // TODO - set some default value, we can have undefined for some of them
        const camera = new THREE.PerspectiveCamera( props.fov, props.aspect || (width / height), props.near, props.far );
        scene.camera = camera;
        camera.render = scene.render;
        scene.add(camera);

        let resizeListener;
        renderer.addResizeListener(resizeListener = (width, height) => {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });

        setCameraManager         ( createCameraManager         (camera, props) );
        setCameraSettingsManager ( createCameraSettingsManager (camera, props) );

        setCamera(camera);
        scene.render();

        return () => {
            delete scene.camera;
            renderer.removeResizeListener(resizeListener);
            scene.remove(camera);
            scene.render();
        }

    }, []);

    cameraSettingsManager && cameraSettingsManager.set(props);
    cameraManager         && cameraManager.set(props);

    return <SceneProvider value={camera}>
        { camera && props.children }
    </SceneProvider>;
}

