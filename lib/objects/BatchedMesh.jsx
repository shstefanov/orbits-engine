import React, { useMemo, useEffect, useState, useRef } from "react";
import * as THREE                   from "three";
import Mesh, { MeshProvider, onlyComponents } from "../objects/Mesh";
import { useScene, SceneProvider }  from "../OrbitsScene.jsx";
import { useRenderer }              from "../OrbitsRenderer.jsx";
import { createInstanceMatrix }     from "./InstancedMesh.jsx";

/*

    <BatchedMesh
        material={...}   // Variant 1

        perObjectFrustumCulled = { true } // boolean, default true
        sortObjects            = { true } // boolean, default true
        maxInstanceCount       = { 5 }            // call mesh.setInstanceCount(n) to update
        customSort             = { function(){} } // call mesh.setCustomSort(fn) to update
        
        // only use together, calls mesh.setGeometrySize(maxVertexCount, maxIndexCount);
        maxVertexCount         = {  }
        maxIndexCount          = {  }



        Each instance can be adjusted with:
        mesh.setColorAt(instanceId, color);
        mesh.setMatrixAt(instanceId, matrix);
        mesh.setVisibleAt(instanceId, boolean);

        mesh.setGeometryIdAt(instanceId, geometryId);




        mesh.addGeometry(geometry)                   // returns geometryId
        mesh.setGeometryAt(geometryId, NewGeometry); // replace geometry at geometryId
        mesh.deleteGeometry(geometryId)              // also removes all instances

        mesh.addInstance(geometryId)
        mesh.deleteInstance(instanceId)

        mesh.optimize();





    >

        <Material ... /> // Variant 2

        <Geometry ... />
        <Geometry ... />
        <Geometry ... />
        <Geometry ... />
        <Geometry ... />




        <BatchedInstance ... />
            
    </BatchedMesh>







*/







export default function BatchedMesh({
    maxInstanceCount = 10000, maxVertexCount = 16000, maxIndexCount = 24000,
    instances,
    children, ...props
}){

    const renderer = useRenderer();
    const scene    = useScene();

    const [ mesh,       setMesh       ] = useState(null);
    const [ material,   setMaterial   ] = useState(props.material || null);
    const collectedGeometries = useMemo(() => new Map(), []);

    useEffect( () => {
        if(!material) return;
        const mesh = new THREE.BatchedMesh( maxInstanceCount, maxVertexCount, maxIndexCount, material);
        // Handling collected geometries;
        for(let [ id, geometry ] of collectedGeometries.entries()){
            const geometryId = mesh.addGeometry(geometry);
            geometry.batchedMeshId = geometryId;
        }
        setMesh(mesh);
        scene.add(mesh);
    }, [material]);


    // Instances be like: 
    // instances = {{
    //     "sphere": [
    //         { position: { x: -20, y: -20, z: -20 }, rotation: { x: 0, y: 0, z: 1.28 }, scale: { x: 1, y: 1, z: 1 } },
    //         { position: { x: -20, y:  20, z: -20 }, rotation: { x: 0, y: 0, z: 1.28 }, scale: { x: 1, y: 1, z: 1 } }
    //     ],
    //     "box": [
    //         { position: { x:  20, y:  20, z: -20 }, rotation: { x: 0, y: 0, z: 1.28 }, scale: { x: 1, y: 1, z: 1 } },
    //         { position: { x:  20, y: -20, z: -20 }, rotation: { x: 0, y: 0, z: 1.28 }, scale: { x: 1, y: 1, z: 1 } }
    //     ],
    // }}

    useEffect(() => {
        if(!mesh) return;

        // Remove all instances in batched mesh
        for(let i = 0; i < mesh.instanceCount; i++){
            mesh.deleteInstance(i);
        }


        for(let geometryName in instances){
            const geometry = collectedGeometries.get(geometryName);
            // Then add again - that is how they are updated currently
            for(let item of instances[geometryName]){
                const instanceId = mesh.addInstance( geometry.batchedMeshId );
                const matrix = createInstanceMatrix(item);
                mesh.setMatrixAt(instanceId, matrix);
                if(item.hasOwnProperty("color")){
                    mesh.setColorAt(instanceId, new THREE.Color(item.color));
                }
            }
        }
        mesh.optimize();
        renderer.render();

    }, [ mesh, instances]);






    const collectContext = useMemo( () => ({

        mesh,

        setGeometry: mesh 
            ? geometry => {
                if(!geometry.userData.hasOwnProperty("id"))       throw new Error("Missing required geometry id attribute in BatchedMesh");
                if(collectedGeometries.has(geometry.userData.id)) throw new Error(`Duplicated geometry id: ${geometry.userData.id}`);
                const geometryId = mesh.addGeometry(geometry);
                collectedGeometries.set(geometry.userData.id, geometry);
                geometry.batchedMeshId = geometryId;
            }

            : geometry => {
                if(!geometry.userData.hasOwnProperty("id"))       throw new Error("Missing required geometry id attribute in BatchedMesh");
                if(collectedGeometries.has(geometry.userData.id)) throw new Error(`Duplicated geometry id: ${geometry.userData.id}`);
                console.log("COLLECTING GEOMETRY BEFORE MESH IS CREATED");
                collectedGeometries.set(geometry.userData.id, geometry);
            },

        setMaterial: _material => {
            if(material) throw new Error("Only one material is allowed in BatchedMesh");
            setMaterial(_material);
        },

        set geometry(geometry) { collectContext.setGeometry(geometry); },

        tmp: true

    }), [mesh, material]);

    return <SceneProvider value = { mesh } >
        {
            !mesh
                ? <MeshProvider value={collectContext}> { onlyComponents(children) } </MeshProvider>
                : <MeshProvider value={collectContext}> { children }                 </MeshProvider>
        }
    </SceneProvider>

}
