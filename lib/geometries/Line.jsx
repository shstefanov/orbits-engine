import React, { useMemo } from "react";
import * as THREE         from "three";
import Mesh               from "../objects/Mesh";
import { useRenderer }    from "../OrbitsRenderer.jsx";

export default function Line({ points, children, ...props }){
    
    const renderer = useRenderer();
    const geometry = useMemo( () => new THREE.BufferGeometry(), []);

    useMemo( () => {
        const vpoints = points.map( ({x, y, z}) => new THREE.Vector3(x, y, z) );
        geometry.setFromPoints( vpoints );
        geometry.attributes.position.needsUpdate;
        renderer.render();
    }, [points]);

    return <Mesh { ...({...props, geometry}) } MeshPrototype={THREE.Line}>{children}</Mesh>;

}



