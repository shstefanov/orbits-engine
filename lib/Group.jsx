import React, { useMemo } from "react";
import * as THREE         from "three";
import Mesh               from "./objects/Mesh";

function blank(){ return new THREE.Group(); }

export default function Line({ children, ...props }){
    const mesh = useMemo( blank, []);
    return <Mesh { ...props } mesh={mesh}>{children}</Mesh>;
}
