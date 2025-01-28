import React, { useState, useEffect, createContext, useContext, useMemo } from "react";
import * as THREE                  from "three";
import { GLTFLoader }              from 'three/addons/loaders/GLTFLoader.js';
import { useScene, SceneProvider } from "../OrbitsScene.jsx";
import { useRenderer }             from "../OrbitsRenderer.jsx";

const objLoader  = new THREE.ObjectLoader();
const gltfLoader = new GLTFLoader();

import createMeshManager  from "../utils/createMeshManager.js";

const objectsCache = new Map();

function createAnimationUpdater(mesh, mixer){
    mesh.updateAnimation = delta => mixer.update(delta);
}

export default function MeshLoader(props){
    
    const renderer = useRenderer();
    const scene    = useScene();

    const [ showHoverElement, setShowHoverElement ] = useState(false);



    // If json is provided or object is stored in cache
    if(props.hasOwnProperty("json")){
        const [ mesh, setMesh ] = useState(null);
        const [ meshManager, setMeshManager ] = useState(createMeshManager(null, props, renderer, mesh));
        useEffect( () => {
            const mesh  = objLoader.parse(props.json);
            if(props.id) mesh.name = props.id;
            const meshManager = createMeshManager(mesh, props, renderer, false);
            meshManager.set(props);
            
            mesh.animations = [];
            setMesh(mesh);
            setMeshManager(meshManager);
            scene.add(mesh);
            props.onCreate && props.onCreate(mesh);
            renderer.render();

            return function(){
                scene.remove(mesh);
                renderer.render();
            };
        }, []);

        if(mesh) {
            const { children, ...pr } = props;
            mesh.userData = pr;
            mesh.setShowHoverElement = setShowHoverElement;
        }

        meshManager.set(props, useEffect);
        return <SceneProvider value={mesh}>
            { showHoverElement && props.hover }
            { props.children }
        </SceneProvider>;
    }
    else if(props.hasOwnProperty("src")){
        
        const [ mesh, setMesh ] = useState(null);
        const [ meshManager, setMeshManager ] = useState(createMeshManager(null, props, renderer, mesh));

        if(mesh) {
            const { children, ...pr } = props;
            mesh.userData = pr;
            mesh.setShowHoverElement = setShowHoverElement;
        }
        
        useEffect(() => {
            let loaded_mesh = null;

            function handleMesh(mesh, animations){

                objectsCache.set(props.src, mesh);

                loaded_mesh = mesh;

                mesh.animations = animations || [];
                
                if(props.id) mesh.name = props.id;
                
                // Handle animations
                if(props.animation && animations){
                    const mixer = new THREE.AnimationMixer( mesh );
                    mesh.animMixer = mixer;

                    mesh.animClips = {};
                    for(let animation of animations){
                        mesh.animClips[animation.name] =  mixer.clipAction( animation );
                    }

                    createAnimationUpdater(mesh, mixer);
                    renderer.addAnimatedObject(mesh);

                }

                // Create meshManager
                const meshManager = createMeshManager(mesh, props, renderer);
                meshManager.set(props);
                
                setMeshManager( meshManager );

                setMesh(mesh);
                
                scene.add( mesh );
                props.onCreate && props.onCreate(mesh);
                renderer.render();
            }

            function handleProgress(xhr){
                props.onProgress && props.onProgress(xhr.loaded / xhr.total * 100);
            }

            function handleError(err){
                props.onError && props.onError(err);
            }


            if(props.src.match(/^.+\.json$/)){
                if(objectsCache.has(props.src)){
                    const object = objectsCache.get(props.src);
                    handleMesh(object, object.animations);
                }
                else objLoader.load(props.src, handleMesh, handleProgress, handleError);
            }



            // GLTF Loader
            else if(props.src.match(/^.+\.(glb|gltf)$/)){
                
                if(objectsCache.has(props.src)){
                    const object = objectsCache.get(props.src);
                    handleMesh(object, object.animations);
                }
                else gltfLoader.load(props.src, (gltf)=>{

                    console.log("GLTF: object", gltf.scene.toJSON());
                    console.log("GLTF: animations", gltf.animations.map( a => a.toJSON() ));

                    gltf.scene.traverse( obj => {
                        if(obj.material) {
                            for(let item of Object.values(obj.material || {})) item instanceof THREE.Texture && ( item => {
                                return item.source.data && renderer.render();
                            })(item);
                        }
                    });

                    handleMesh(gltf.scene, gltf.animations);
                }, handleProgress, handleError);
            }

            return () => {
                if(loaded_mesh){
                    scene.remove(loaded_mesh);
                    loaded_mesh.animMixer && renderer.removeAnimatedObject(loaded_mesh);
                    renderer.render();
                }
            }
            
        }, [props.src]);

        meshManager.set(props, useEffect);

        return <SceneProvider value={mesh}>
            { mesh && showHoverElement && props.hover }
            { mesh && props.children }
        </SceneProvider>
    }
    
}