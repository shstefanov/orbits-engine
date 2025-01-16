import React, { useState, useEffect } from "react";
import { useScene, SceneProvider } from "../OrbitsScene.jsx";
import { useRenderer } from "../OrbitsRenderer.jsx";
import * as THREE from "three";
import createMeshManager from "../utils/createMeshManager.js";

// https://threejs.org/docs/#api/en/lights/PointLight
export default function PointLight(props){
    
    const renderer = useRenderer();
    const scene = useScene();
    const [ light, setLight ] = useState(null);

    const [ meshManager, setMeshManager ] = useState(createMeshManager(null, props, renderer, light));

    useEffect(() => {

        // color - (optional) hexadecimal color of the light. Default is 0xffffff (white).
        // intensity - (optional) numeric value of the light's strength/intensity. Default is 1.
        // distance - Maximum range of the light. Default is 0 (no limit).
        // decay - The amount the light dims along the distance of the light. Default is 2.


        const light = new THREE.PointLight(
            props.color     || 0xffffff, 
            props.intensity || 1,
            props.distance  || 0,
            props.decay     || 2
        );

        light.render = scene.render;

        const meshManager = createMeshManager(light, props, renderer);
        meshManager.set(props);
        setMeshManager( meshManager );
        
        
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

    props.hasOwnProperty("castShadow") && useEffect( () => {
        if(light){ light.castShadow = props.castShadow; renderer.render(); }
    }, [light && props.castShadow]);

    props.hasOwnProperty("decay") && useEffect( () => {
        if(light){ light.decay = props.decay; renderer.render(); }
    }, [light && props.decay]);

    props.hasOwnProperty("distance") && useEffect( () => {
        if(light){ light.distance = props.distance; renderer.render(); }
    }, [light && props.distance]);

    props.hasOwnProperty("power") && useEffect( () => {
        if(light){ light.power = props.power; renderer.render(); }
    }, [light && props.power ]);

    props.hasOwnProperty("shadow") && useEffect( () => {
        if(light){ light.shadow = props.shadow; renderer.render(); }
    }, [light && props.shadow  ]);

    meshManager.set(props, useEffect);

    return <SceneProvider value={light}>
        { light && props.children }
    </SceneProvider>;
}