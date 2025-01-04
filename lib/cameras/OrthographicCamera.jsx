// import React, { useEffect, useState, createContext } from "react";
// import * as THREE from "three";
// import { useRenderer } from "../OrbitsRenderer.jsx";
// import { SceneProvider, useScene } from "../OrbitsScene.jsx";


// export default function OrthographicCamera(){
//     return null;
// }

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
    const [ cameraManager, setCameraManager ] = useState(createOrthographicCameraManager(null, props, renderer.domElement, camera));

    useEffect(() => {
        const { width, height } = renderer.actualSize;

        const left   = props.hasOwnProperty("left")   ? props.left   : width  / -2;
        const right  = props.hasOwnProperty("right")  ? props.right  : width  /  2;
        const top    = props.hasOwnProperty("top")    ? props.top    : height /  2;
        const bottom = props.hasOwnProperty("bottom") ? props.bottom : height / -2;

        // TODO - set some default value, we can have undefined for some of them
        const camera = new THREE.OrthographicCamera( left, right, top, bottom, props.near, props.far );
        scene.camera = camera;
        camera.render = scene.render;

        // If there is no props.aspect, means it will be autocomputed from viewport size
        let resizeListener;
        if(!props.hasOwnProperty("left")){
            renderer.addResizeListener(resizeListener = (width, height) => {
                camera.left   = width  / -2;
                camera.right  = width  /  2;
                camera.top    = height /  2;
                camera.bottom = height / -2;
                camera.updateProjectionMatrix();
                camera.render();
                if(!camera.initialViewPort) camera.initialViewPort = {
                    left: camera.left, right: camera.right,
                    top: camera.top,   bottom: camera.bottom,
                }

                if(props.hasOwnProperty("viewport")) {
                    camera.viewport = props.viewport;
                    camera.updateMatrixWorld();
                }

                scene.add(camera);
                setCameraManager( createOrthographicCameraManager(camera, props, renderer.domElement) );

                setCamera(camera);
                scene.render();
            });
        }

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


