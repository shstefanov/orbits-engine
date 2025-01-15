import React, { useState, useEffect, createContext, useContext } from "react";

import * as THREE from 'three';
import { useRenderer } from "./OrbitsRenderer.jsx";
const sceneContext    = createContext();
export const useScene = () => useContext(sceneContext);

export const SceneProvider = sceneContext.Provider;

window.THREE = THREE;

export default function OrbitsScene({
    children    = false,
    renderOrder = 0,
    active      = true,
    clearDepth  = false,
    ...options
}){

    const renderer            = useRenderer();
    const [ scene, setScene ] = useState(null);

    useEffect( () => {
        const scene = new THREE.Scene();
        scene.renderOrder = renderOrder;
        scene.waitFor = renderer.waitFor.bind(renderer);
        renderer.addScene(scene);
        scene.render         = () => { renderer.doRender = true; }
        scene.addAnimated    = mesh => renderer.addAnimatedMesh(mesh);
        scene.removeAnimated = mesh => renderer.removeAnimatedMesh(mesh);
        setScene(scene);
        return () => renderer.removeScene(scene);
    }, []);

    // Handle renderOrder
    if(options.hasOwnProperty("renderOrder")) useEffect( () => {
        if(scene){
            scene.renderOrder = renderOrder;
            renderer.updateScene(scene);
        }
    }, [scene && renderOrder, ]);

    // Handle clearDepth
    if(options.hasOwnProperty("clearDepth")) useEffect( () => {
        if(scene){
            scene.clearDepth = clearDepth || 0;
            renderer.updateScene(scene);
        }
    }, [scene && clearDepth]);

    // Handle options.background and related options here
    if(options.hasOwnProperty("background")){
        
        useEffect( () => {
            if(!scene) return;
            // if(!options.background) scene.background = null;
            if(typeof options.background === "number") {
                scene.background = new THREE.Color().setHex( options.background );
                scene.render();
            }
            else if(typeof options.background === "string") { // Hex color or image url
                if(options.background.match(/^#[0-9a-z]{6}$/)){
                    scene.background = new THREE.Color().setHex( parseInt(options.background.replace("#", "0x")) );
                    scene.render();
                }
                else {
                    scene.background = new THREE.TextureLoader()
                    .load( options.background, () => scene.render() );
                }
            }
            else if(Array.isArray(options.background)){ // 6 image urls for CubeTexture
                scene.background = new THREE.CubeTextureLoader()
                .load( options.background, () => scene.render() );
            }
            else if(options.background instanceof THREE.Texture) {
                scene.background = options.background;
                renderer.waitFor(() => {
                   if(scene.background.source.data){
                     return renderer.doRender = true
                   } 
                })
            }
            else scene.background = null;
            
            renderer.updateScene();
    
            // const color = new THREE.Color().setHex( 0x112233 );
    
        }, [scene && options.background]);
        
        // Handle options.backgroundBlurriness here
        if(options.hasOwnProperty("backgroundBlurriness")) useEffect( () => {
            if(scene) {
                scene.backgroundBlurriness = options.backgroundBlurriness || 0;
                renderer.updateScene();
            }
        }, [scene && options.backgroundBlurriness ]);
        
        // Handle options.backgroundIntensity here
        if(options.hasOwnProperty("backgroundIntensity")) useEffect( () => {
            if(!scene) return;
            scene.backgroundIntensity = options.backgroundIntensity;
            renderer.updateScene();
        }, [scene && typeof options.backgroundIntensity ]);
        
        // Handle options.backgroundRotation
        if(options.hasOwnProperty("backgroundRotation")) useEffect( () => {
            if(!scene) return;
            scene.backgroundRotation = THREE.Euler( ...[...options.backgroundRotation, 'XYZ'] );
            renderer.updateScene();
        }, [scene, ...options.backgroundRotation ]);

    }

    // Handle options.background and related options here
    if(options.hasOwnProperty("environment")){
        
        useEffect( () => {
            if(!scene) return;
            scene.environment = options.environment || null;
            renderer.updateScene();
        }, [scene && options.environment ]);

        if(options.hasOwnProperty("environmentIntensity")) useEffect( () => {
            if(!scene) return;
            scene.environmentIntensity = options.environmentIntensity ;
            renderer.updateScene();
        }, [scene && options.environmentIntensity  ]);

        if(options.hasOwnProperty("environmentRotation")) useEffect( () => {
            if(!scene) return;
            scene.environmentRotation = THREE.Euler( ...[...options.environmentRotation, 'XYZ'] );
            renderer.updateScene();
        }, [scene, ...options.environmentRotation ]);

    }

    if(!scene) return null;

    

    return <SceneProvider value={scene}>
        { scene && children }
    </SceneProvider>;

}