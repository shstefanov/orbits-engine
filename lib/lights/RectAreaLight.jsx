import React, { useState, useEffect } from "react";
import { useScene, SceneProvider } from "../OrbitsScene.jsx";
import { useRenderer } from "../OrbitsRenderer.jsx";
import * as THREE from "three";
import createLightManager from "../utils/createLightManager.js";

// https://threejs.org/docs/#api/en/lights/RectAreaLight
export default function RectAreaLight({children, ...props}){
    
    const renderer = useRenderer();
    const scene = useScene();
    const [ light, setLight ] = useState(null);

    const [ lighthManager, setLightManager ] = useState(createLightManager(null, props, renderer, light));

    useEffect(() => {
        const light = new THREE.RectAreaLight(props.color, props.intensity, props.width, props.height);
        const lightManager = createLightManager(light, props, renderer);
        setLightManager( lightManager );
        
        
        scene.add(light);
        setLight(light);
        renderer.render();
        return () => {
            light.dispose();
            scene.remove(light);
            renderer.render();
        }
    }, []);

    lighthManager.set(props, useEffect);

    return light && <SceneProvider value = { light } > { children } </SceneProvider>;
}