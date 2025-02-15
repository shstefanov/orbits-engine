import React, { useEffect } from "react";
import * as THREE  from "three";
import { useMesh } from "../objects/Mesh.jsx";
import { useRenderer } from "../OrbitsRenderer.jsx";
import { applyGeometry } from "./Geometries.jsx";

export default function BufferGeometry({ indices, children, ...attrs }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const geometry = new THREE.BufferGeometry();

        const { groupSize, length, map, offsets, order, sizes } = getAttrParams(attrs);

        let interleavedData;
        if(
               mesh.geometryParams?.groupSize === groupSize
            && mesh.geometryParams?.length === length
            && mesh.geometryParams?.order.join(".") === order.join(".")
        ){
            interleavedData = mesh.geometryParams.array;
        }

        else interleavedData = new Float32Array(groupSize * length);

        mesh.geometryParams = { groupSize, length, map, offsets, order, sizes, array: interleavedData };
        
        for(let i = 0; i < length; i++){

            for(let attr of order){
                const propMap = map[attr];
                const offset  = offsets[attr];
                const size    = sizes[attr];
                const values  = propMap(attrs[attr][i]);
                for(let j = 0; j < size; j++){
                    const groupOffset = i * groupSize;
                    interleavedData[groupOffset + offset + j] = values[j];
                }
            }
        }

        const interleavedBuffer = new THREE.InterleavedBuffer(interleavedData, groupSize);

        for(let attr of order){
            const offset  = offsets[attr];
            const size    = sizes[attr];
            geometry.setAttribute(attr, new THREE.InterleavedBufferAttribute(interleavedBuffer, size, offset));
            geometry.attributes[attr].needsUpdate = true;
        }

        if(indices) geometry.setIndex(indices);

        applyGeometry(renderer, mesh, geometry);
    }, Object.keys(attrs).sort().map( name => attrs[name] ));
    return null;
}

BufferGeometry.isMeshComponent = true;

function getAttrParams(attrs){
    const result = { groupSize: 0, map: {}, offsets: {}, order: [], sizes: {} };
    for(let key in attrs) {
        result.order.push(key);
        if(!result.hasOwnProperty("length")) result.length = attrs[key].length;
        else if(attrs[key].length !== result.length) throw new Error(`Attribute size error: ${key}`);
        if(!result.map.hasOwnProperty(key)) result.map[key] = getAttrMap(attrs[key][0]);
        result.offsets[key] = result.groupSize;
        const size = Object.keys(attrs[key][0]).length;
        result.sizes[key] = size;
        result.groupSize += size;
    }
    return result;
}

const attrTypesMap = {
    "xy": ({x,y}) => [x,y], "xyz": ({x,y,z}) => [x,y,z],
    "uv": ({u,v}) => [u,v], "rgb": ({r,g,b})  => [r,g,b],
    "rgba": ({r,g,b,a})  => [r,g,b,a],
    defaultArrayType: a => a,
};

const attrNameVals = "xyzuvrgba0123456789"; // Numbers are in case we are using arrays

function sortAttrElements(a,b) { return attrNameVals.indexOf(a) - attrNameVals.indexOf(b); }

function getAttrMap(element){
    const type = Object.keys(element).sort( sortAttrElements ).join("");
    if(attrTypesMap.hasOwnProperty(type)) return attrTypesMap[type] || attrTypesMap.defaultArrayType;
}