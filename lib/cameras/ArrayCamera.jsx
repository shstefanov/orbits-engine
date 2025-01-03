import React, { useEffect, useState, createContext, useMemo } from "react";
import * as THREE from "three";
import { useRenderer } from "../OrbitsRenderer.jsx";
import { SceneProvider, useScene } from "../OrbitsScene.jsx";
import createCameraManager from "../utils/createCameraManager.js";


import PerspectiveCamera from "./PerspectiveCamera.jsx";
import OrthographicCamera from "./OrthographicCamera.jsx";
import StereoCamera from "./StereoCamera.jsx";
import CubeCamera from "./CubeCamera.jsx";
import { add } from "three/tsl";

const cameraTypes = [ PerspectiveCamera, OrthographicCamera, StereoCamera, CubeCamera ];

export default function ArrayCamera(props){

    const renderer = useRenderer();
    const scene    = useScene();

    const [ camera,          setCamera          ] = useState(null);
    const [ numberOfCameras, setNumberOfCameras ] = useState(0);
    const [ cameraManager,   setCameraManager   ] = useState(createCameraManager(null, props, renderer.domElement, camera));

    const mockContext = useMemo( () => ({
        render: scene.render,
        cameras: [],
        remove: () => {},
        add: function(camera) {
            if(camera instanceof THREE.Camera){
                this.cameras.push(camera);
                setNumberOfCameras(this.cameras.length);
            }
        }
    }), []);

    useEffect( () => {

        const expectedCamerasNumber = props.children.filter( c => cameraTypes.indexOf(c?.type) > -1 ).length;
        if(numberOfCameras < expectedCamerasNumber) return;

        const camera = new THREE.ArrayCamera( mockContext.cameras );
        scene.camera = camera;
        scene.add(camera);
        
        setCamera(camera);
        setCameraManager(createCameraManager(null, props, renderer.domElement));

        return () => {
            scene.remove(camera);
        };
    }, [numberOfCameras]);





    return <SceneProvider value={mockContext}>
        { props.children }
</SceneProvider>;
}