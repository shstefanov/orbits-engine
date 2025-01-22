import React, { useMemo } from "react";
import * as THREE         from "three";
import Mesh               from "../objects/Mesh";

function blank(){ return new THREE.BufferGeometry(); }

export default function Line({ children, ...props }){
    const geometry = useMemo( blank, []);
    return <Mesh { ...({...props, geometry}) } MeshPrototype={THREE.Line}>{children}</Mesh>;
}
