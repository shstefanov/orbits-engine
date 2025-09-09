import React, { useState, useEffect } from "react";
import * as THREE                     from "three";
import { useMesh }                    from "../objects/Mesh.jsx";



export default function BoxGeometry(props){
    const mesh = useMesh();
    useEffect(() => {
        const geometry = new THREE.BoxGeometry( ...( props.size || [] ) );
        mesh.setGeometry(geometry);
    }, []);
    return null;
}

BoxGeometry.isMeshComponent = true;