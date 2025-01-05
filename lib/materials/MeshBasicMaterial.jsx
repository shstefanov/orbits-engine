import React, { useState, useEffect } from "react";
import * as THREE                     from "three";
import { useMesh }                    from "../objects/Mesh.jsx";



export default function MeshBasicMaterial(props){
    const { children, key, ...options } = props;
    const mesh = useMesh();
    const [ material, setMaterial ] = useState(null);
    // Creating the mesh here
    useEffect( material
        
        // Update created material
        ? () => {

            console.log("Update material ???");

            Object.assign(material, options);
            material.needsUpdate;
            mesh.render();
        }
        
        // Create initial material
        : () => {

            console.log("Create new material ???");

            const material = new THREE.MeshBasicMaterial( options );
            setMaterial(material);
            mesh.setMaterial(material);
        },
        
        Object.values(options)  // The array of values to watch
    );

    return props.children;
}

MeshBasicMaterial.isMeshComponent = true;