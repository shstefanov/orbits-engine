import React, { useState, useEffect } from "react";
import { useScene, SceneProvider } from "../OrbitsScene.jsx";
import * as THREE from "three";
import createTransformManager from "../utils/createMeshManager.js";

// https://threejs.org/docs/#api/en/lights/PointLight
export default function PointLight(props){
    const scene = useScene();
    const [ light, setLight ] = useState(null);

    const [ transformManager, setTransformManager ] = useState(createTransformManager(null, props, light));


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


        console.log("ADD POINLIGHT TO: ", scene);

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
        if(light){ light.color.set(props.color); scene.render(); }
    }, [light && props.color]);

    props.hasOwnProperty("intensity") && useEffect( () => {
        if(light){ light.color.set(props.color); scene.render(); }
    }, [light && props.color]);

    props.hasOwnProperty("castShadow") && useEffect( () => {
        if(light){ light.castShadow = props.castShadow; scene.render(); }
    }, [light && props.castShadow]);

    props.hasOwnProperty("decay") && useEffect( () => {
        if(light){ light.decay = props.decay; scene.render(); }
    }, [light && props.decay]);

    props.hasOwnProperty("distance") && useEffect( () => {
        if(light){ light.distance = props.distance; scene.render(); }
    }, [light && props.distance]);

    props.hasOwnProperty("power") && useEffect( () => {
        if(light){ light.power = props.power ; scene.render(); }
    }, [light && props.power ]);

    props.hasOwnProperty("shadow") && useEffect( () => {
        if(light){ light.shadow = props.shadow  ; scene.render(); }
    }, [light && props.shadow  ]);

    transformManager && transformManager.set(props);

    return <SceneProvider value={light}>
        { light && props.children }
    </SceneProvider>;
}