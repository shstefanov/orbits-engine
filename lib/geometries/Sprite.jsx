import React, { useMemo } from "react";
import * as THREE         from "three";
import Mesh from "../objects/Mesh";

class OrbitsSprite extends THREE.Sprite {
    constructor(g, m){ return super(m); } // Bypass geometry to use common mesh scheme
}

const dummyGeometry = {};

export default function Sprite({ children, ...props }){
    return <Mesh geometry = {dummyGeometry} {...props} MeshPrototype={OrbitsSprite}>{children}</Mesh>;
}
