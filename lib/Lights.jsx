import React, { useState, useEffect } from "react";
import { useScene } from "./OrbitsScene.jsx";
import * as THREE from "three";

// https://threejs.org/docs/#api/en/lights/AmbientLight
export function AmbientLight(props){

    const scene = useScene();
    const [ light, setLight ] = useState(null);

    useEffect(() => {
        const light = new THREE.AmbientLight(props.color || 0xffffff, props.intensity || 1);
        scene.add(light);
        setLight(light);
        scene.render();
        return () => {
            light.dispose();
            scene.remove(light);
            scene.render();
        }
    }, []);

    props.hasOwnProperty("color") && useEffect( () => {
        if(light){
            light.color.set(props.color);
            scene.render();
        }
    }, [light && props.color]);

    props.hasOwnProperty("intensity") && useEffect( () => {
        if(light){
            light.color.set(props.color);
            scene.render();
        }
    }, [light && props.color]);

    return null;
}

// https://threejs.org/docs/#api/en/lights/DirectionalLight
export function DirectionalLight(){

}

// https://threejs.org/docs/#api/en/lights/PointLight
export function PointLight(){

}

// https://threejs.org/docs/#api/en/lights/SpotLight
export function SpotLight(){

}

// https://threejs.org/docs/#api/en/lights/HemisphereLight
export function HemisphereLight(){

}

// https://threejs.org/docs/#api/en/lights/RectAreaLight
export function RectAreaLight(){

}

// https://threejs.org/docs/#api/en/lights/LightProbe
export function LightProbe(){

}

