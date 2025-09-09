import React, { useMemo } from "react";
import * as THREE         from "three";
import Mesh               from "../objects/Mesh";

export default function Points({ children, ...props }){
    const geometry = useMemo( () => new THREE.BufferGeometry(), []);
    return <Mesh { ...({...props, geometry}) } MeshPrototype={THREE.Points}>{children}</Mesh>;
}
