import React, { useEffect, useState, createContext } from "react";
import * as THREE from "three";
import { useRenderer } from "../OrbitsRenderer.jsx";
import { SceneProvider, useScene } from "../OrbitsScene.jsx";
import createOrthographicCameraManager from "../utils/createOrthographicCameraManager.js";


export function useCamera( scene = useScene() ){
    return scene?.camera || ( scene.patent && useCamera(scene.parent) );
}

export default function OrthographicCamera(props){

    const renderer = useRenderer();
    const scene    = useScene();

    const [ camera,        setCamera        ] = useState(null);
    const [ cameraManager, setCameraManager ] = useState(createOrthographicCameraManager(null, props, renderer, camera));

    useEffect(() => {
        const size = renderer.getSize();

        const left   = props.hasOwnProperty("left")   ? props.left   : size.width  / -2;
        const right  = props.hasOwnProperty("right")  ? props.right  : size.width  /  2;
        const top    = props.hasOwnProperty("top")    ? props.top    : size.height /  2;
        const bottom = props.hasOwnProperty("bottom") ? props.bottom : size.height / -2;

        // TODO - set some default value, we can have undefined for some of them
        const camera = new THREE.OrthographicCamera( left, right, top, bottom, props.near, props.far );
        scene.camera = camera;
        camera.render = scene.render;

        // If there is no props.aspect, means it will be autocomputed from viewport size
        let resizeListener;
        if(!props.hasOwnProperty("left")){
            renderer.addResizeListener(resizeListener = (size) => {
                camera.left   = size.width  /  2;
                camera.right  = size.width  / -2;
                camera.top    = size.height / -2;
                camera.bottom = size.height /  2;
                camera.updateProjectionMatrix();
                renderer.render();
                if(!camera.initialViewPort) camera.initialViewPort = {
                    left: camera.left, right: camera.right,
                    top: camera.top,   bottom: camera.bottom,
                }

                if(props.hasOwnProperty("viewport")) {
                    camera.viewport = props.viewport;
                    camera.updateMatrixWorld();
                }

                scene.add(camera);

                setCameraManager( createOrthographicCameraManager(camera, props, renderer) );

                setCamera(camera);
                renderer.render();
            });
        }

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


