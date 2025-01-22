import React, { useMemo } from "react";
import * as THREE         from "three";
import Mesh               from "../objects/Mesh";

export default function LineSegment({ children, ...props }){
    const geometry = useMemo( () => new THREE.BufferGeometry(), []);
    return <Mesh { ...({...props, geometry}) } MeshPrototype={THREE.LineSegments}>{children}</Mesh>;
}
