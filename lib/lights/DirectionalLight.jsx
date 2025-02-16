import React, { useState, useEffect } from "react";
import { useScene, SceneProvider }    from "../OrbitsScene.jsx";
import { useRenderer }                from "../OrbitsRenderer.jsx";
import * as THREE                     from "three";
import createLightManager             from "../utils/createLightManager.js";


// https://threejs.org/docs/#api/en/lights/DirectionalLight
export default function DirectionalLight({children, ...props}){
    const renderer = useRenderer();
    const scene    = useScene();
    
    const [ light,        setLight        ] = useState(null);
    const [ lightManager, setLightManager ] = useState(createLightManager(null, props, renderer, light));

    useEffect(() => {
        const light = new THREE.DirectionalLight(props.color, props.intensity);
        light.target = new THREE.Object3D();
        setLightManager( createLightManager(light, props, renderer) );
        scene.add(light); scene.add(light.target);
        setLight(light);
        renderer.render();
        return () => {
            light.dispose();
            scene.remove(light); scene.remove(light.target);
            renderer.render();
        }
    }, []);

    lightManager.set(props, useEffect);

    return light && <SceneProvider value = { light } > { children } </SceneProvider>;
}