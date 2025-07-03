import React, { useState, useEffect } from "react";
import * as THREE         from "three";
import Mesh               from "./Mesh";
import { useRenderer }    from "../OrbitsRenderer";
import createMeshManager  from "../utils/createMeshManager";
import { useScene, SceneProvider } from "../OrbitsScene";

export default function SkinnedMesh({ children, onCreate, ...props }){

    const renderer                      = useRenderer();
    const [ mesh, setMesh ]             = useState(null);
    const [ skinHelper, setSkinHelper ] = useState(null);

    // Managing skinHelper option
    props.hasOwnProperty("skinHelper") && useEffect( () => {
        if(!mesh) return;
        if(props.skinHelper && !skinHelper){
            const helper = new THREE.SkeletonHelper(mesh);
            setSkinHelper(helper);
            mesh.add(helper);
            renderer.render();
        }
        if(!props.skinHelper && skinHelper){
            mesh.remove(skinHelper);
            setSkinHelper(null);
            renderer.render();
        }
    }, [props.skinHelper, mesh]);

    return <Mesh
        { ...props }
        onCreate = { mesh => {
            const bones = [];
            mesh.bones = bones;
            createBones( children, bones, mesh );
            bones.forEach( bone => { bone.bones = bones; } );
            const skeleton = new THREE.Skeleton(bones);
            mesh.bind(skeleton);
            setMesh(mesh);
        }}
        MeshPrototype={THREE.SkinnedMesh}
    >
        { children }
    </Mesh>;
}


SkinnedMesh.Bone = function Bone(props){ 
    const renderer = useRenderer();
    const parent   = useScene(props.index);
    const [ bone, setBone ] = useState(null);
    const [ meshManager,  setMeshManager  ] = useState( createMeshManager(null, props, renderer, bone) );
    useEffect( () => {
        if(!parent?.bones[props.index]) return;
        const bone = parent.bones[props.index];
        bone.bones = parent.bones;
        setBone(bone);
        const meshManager = createMeshManager(bone, props, renderer);
        setMeshManager(meshManager);
        props.onCreate && props.onCreate(bone);
    }, [parent?.bones[props.index]]);

    meshManager.set(props, useEffect);
    return <SceneProvider value={bone}>{props.children || null}</SceneProvider>
}

SkinnedMesh.Bone.isMeshComponent = true;

function createBones( children, bones = [], parent = null ){
    if(!Array.isArray(children)) children = [children];
    for(let c of children) if(c?.type === SkinnedMesh.Bone) {
        const bone = new THREE.Bone();
        c.props.position && bone.position .set(c.props.position.x, c.props.position.y, c.props.position.z        );
        c.props.rotation && bone.rotation .set(c.props.rotation.x, c.props.rotation.y, c.props.rotation.z, "XYZ" );
        c.props.scale    && bone.scale    .set(c.props.scale.x,    c.props.scale.y,    c.props.scale.z           );
        parent.add(bone);
        bones[c.props.index] = bone;
        if(c.props.children) createBones(c.props.children, bones, bone);
    }
}
