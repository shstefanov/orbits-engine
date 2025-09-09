import React, { useState, useEffect } from "react";
import * as THREE                     from "three";
import { useMesh }                    from "../objects/Mesh.jsx";
import { useRenderer }                from "../OrbitsRenderer.jsx";
import createMaterialManager          from "../utils/createMaterialManager.js";


export default function Material(props){

    const renderer = useRenderer();
    const mesh = useMesh();

    const [ material, setMaterial ]               = useState(null);
    const [ materialManager, setMaterialManager ] = useState(!material && createMaterialManager(material, props, renderer, !!material));

    useEffect( () => {
        const material = new THREE[props.type || "MeshBasicMaterial"]();
        setMaterial(material);
        setMaterialManager(createMaterialManager(material, props, renderer));
        setTimeout(() => mesh.setMaterial(material), 0);
        return () => material.dispose();
    }, []);
    

    materialManager.set(props, useEffect);


    return null;
}

Material.isMeshComponent = true;