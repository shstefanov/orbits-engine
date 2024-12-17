import React, { useEffect, useState, createContext } from "react";
import * as THREE from "three";
import { useRenderer } from "./OrbitsRenderer.jsx";
import { SceneProvider, useScene } from "./OrbitsScene.jsx";

export function useCamera(){
    const scene = useScene();
    return scene?.camera || null;
}



export function PerspectiveCamera({
    children,
    fov = 45,
    aspect = null,
    near = 1,
    far = 1000,
}){

    const renderer = useRenderer();
    const scene    = useScene();

    const [ camera, setCamera ] = useState(null);

    useEffect(() => {
        console.log("camera ??", scene);
        const { width, height } = renderer.actualSize;
        const camera = new THREE.PerspectiveCamera( fov, aspect || (width / height), near, far );
        scene.camera = camera;
        scene.add(camera);

        let resizeListener;
        renderer.addResizeListener(resizeListener = (width, height) => {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });

        setCamera(camera);
        scene.render();

        return () => {
            delete scene.camera;
            renderer.removeResizeListener(resizeListener);
            scene.remove(camera);
            scene.render();
        }

    }, []);

    return <SceneProvider value={camera}>
        { camera && children }
    </SceneProvider>;
}




export function ArrayCamera(){
    return null;
}


export function Camera(){
    return null;
}


export function CubeCamera(){
    return null;
}


export function OrthographicCamera(){
    return null;
}




export function StereoCamera(){
    return null;
}




