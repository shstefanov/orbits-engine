import React, { useState, useEffect, createContext, useContext, useMemo } from "react";
import * as THREE                  from "three";
import { GLTFLoader }              from 'three/addons/loaders/GLTFLoader.js';
import { useScene, SceneProvider } from "../OrbitsScene.jsx";

const objLoader  = new THREE.ObjectLoader();
const gltfLoader = new GLTFLoader();

import createMeshManager from "../utils/createMeshManager.js";

const objectsCache = new Map();

function createAnimationUpdater(mesh, mixer){
    mesh.updateAnimation = delta => mixer.update(delta);
}

export default function MeshLoader(props){
    
    const scene = useScene();

    // If json is provided or object is stored in cache
    if(props.hasOwnProperty("json") || objectsCache.has(props.src) ){
        const { mesh, meshManager } = useMemo( () => {
            const mesh  = objLoader.parse(props.json || objectsCache.get(props.src));
            if(props.id) newMesh.name = props.id;
            mesh.render = scene.render;
            const meshManager = createMeshManager(mesh, props, false);
            meshManager && meshManager.set(props);
            scene.add(mesh);
            scene.render();
            return { mesh, meshManager };
        }, []);
        // console.log("MESHMANAGER::::", meshManager);
        meshManager && meshManager.set(props, useEffect);
        return <SceneProvider value={mesh}>{props.children}</SceneProvider>;
    }
    else if(props.hasOwnProperty("src")){
        const [ mesh, setMesh ] = useState(null);
        const [ meshManager, setMeshManager ] = useState(createMeshManager(null, props, mesh));

        useEffect(() => {
            let loaded_mesh = null;

            function handleMesh(mesh, animations){
                loaded_mesh = mesh;
                
                // Pass render and other global handlers trough the hierarchy
                mesh.render         = scene.render;
                mesh.addAnimated    = scene.addAnimated;
                mesh.removeAnimated = scene.removeAnimated;
                
                if(props.id) mesh.name = props.id;
                
                // Handle animations
                if(props.animation && animations){
                    const mixer = new THREE.AnimationMixer( mesh );
                    mesh.animMixer = mixer;

                    mesh.animClips = {};
                    for(let animation of animations){
                        console.log("animation.name", animation.name);
                        mesh.animClips[animation.name] =  mixer.clipAction( animation );
                    }

                    createAnimationUpdater(mesh, mixer);
                    scene.addAnimated(mesh);

                }

                // Create meshManager
                if(meshManager){
                    const meshManager = createMeshManager(mesh, props);
                    meshManager.set(props);
                    setMeshManager( meshManager );
                }

                setMesh(mesh);
                
                scene.add( mesh );

                props.onCreate && props.onCreate(mesh);
                
                scene.render();
                // setTimeout(() => scene.render(), 3000);
            }

            function handleProgress(xhr){
                // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            }

            function handleError(err){
                console.error( err );
            }


            if(props.src.match(/^.+\.json$/)){
                objLoader.load(props.src, handleMesh, handleProgress, handleError);
            }



            // GLTF Loader
            else if(props.src.match(/^.+\.(glb|gltf)$/)){
                
                // https://sbedit.net/a3ff4f37795ce85098816514bd00d3ab822f2fd7#L173-L173
                gltfLoader.load(props.src, (gltf)=>{
                    handleMesh(gltf.scene, gltf.animations);
                }, handleProgress, handleError);
            }

            return () => {
                if(loaded_mesh){
                    scene.remove(loaded_mesh);
                    loaded_mesh.animMixer && scene.removeAnimated(loaded_mesh);
                    scene.render();
                }
            }
            
        }, [props.src]);

        meshManager && meshManager.set(props, useEffect);

        return <SceneProvider value={mesh}> { mesh && props.children } </SceneProvider>
    }
    
}