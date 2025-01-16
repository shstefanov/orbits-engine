import React, { useState, useEffect } from "react";
import { useScene } from "../OrbitsScene.jsx";
import { useRenderer } from "../OrbitsRenderer.jsx";
import * as THREE from "three";

// https://threejs.org/docs/#api/en/lights/AmbientLight
export default function AmbientLight(props){
    
    const renderer = useRenderer();
    const scene = useScene();
    const [ light, setLight ] = useState(null);

    useEffect(() => {
        const light = new THREE.AmbientLight(props.color || 0xffffff, props.intensity || 1);
        scene.add(light);
        setLight(light);
        renderer.render();
        return () => {
            light.dispose();
            scene.remove(light);
            renderer.render();
        }
    }, []);

    props.hasOwnProperty("color") && useEffect( () => {
        if(light){ light.color.set(props.color); renderer.render(); }
    }, [light && props.color]);

    props.hasOwnProperty("intensity") && useEffect( () => {
        if(light){ light.intensity = props.intensity; renderer.render(); }
    }, [light && props.intensity]);

    return null;
}