import React, { useMemo, useState } from "react";
import * as THREE         from "three";
import Mesh from "../objects/Mesh";


export default function InstancedMesh({ children, ...props }){

    const [ mesh, setMesh ] = useState(null);

    const instanceMatrix = props.instanceBuffer
        
        ? props.instanceBuffer(mesh?.instanceMatrix)
        
        : useMemo( () => {
            const buffer = createInstanceMatrix(props.instances, mesh?.instanceMatrix);
            buffer.sate = props.instances.state;
            return buffer;
    }, [ props.instances, props.instances.length, props.instances.state ] );

    const count = props.forceCount || (props.instanceBuffer ? instanceMatrix.array.length / 16 : props.instances.length);

    return <Mesh {...props}
        instanceMatrix = { instanceMatrix         }
        instanceCount  = { count                  }
        MeshPrototype  = { THREE.InstancedMesh    }
        onCreate       = { setMesh                }
    >{children}</Mesh>;
}





/*
    Function that produces instanceBuffer for instancedMesh
    The input is 'instances' array and it contains objects of type:
    [
        {
            position: { x: 20,  y: 10, z: 5    }, // Optional
            rotation: { x: 0.5, y: 1,  z: 1.28 }, // Optional, radians
            scale:    { x: 0.5, y: 1,  z: 1    }, // Optional
        },
        ...
    ]

*/


const empty_matrix_buffer = new THREE.InstancedBufferAttribute(new Float32Array(0), 16).setUsage(THREE.DynamicDrawUsage);
function createInstanceMatrix(instances, prev_buffer = empty_matrix_buffer){

    if(!instances.length){ // Return empty buffer
        const empty = empty_matrix_buffer.clone();
        // empty.needsUpdate = true;
        return empty;
    }

    let matrix_buffer, matrix_array;

    if(instances.length === ( prev_buffer.array.length / 16 ) ){
        matrix_buffer = prev_buffer;
    }
    else {
        matrix_array  = new Float32Array( instances.length * 16 );
        matrix_buffer = new THREE.InstancedBufferAttribute(matrix_array, 16).setUsage(THREE.DynamicDrawUsage);
    }

    let index = 0;
    for( let { position, rotation, scale } of instances){

        const matrix = new THREE.Matrix4();

        position ? matrixPos   .set( position.x, position.y, position.z        ) : matrixPos   .set(0, 0, 0);
        rotation ? matrixEuler .set( rotation.x, rotation.y, rotation.z, "XYZ" ) : matrixEuler .set(0, 0, 0, "XYZ");
        scale    ? matrixScale .set( scale.x,    scale.y,    scale.z           ) : matrixScale .set(1, 1, 1);

        const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(matrixEuler);

        scale    && matrix.scale(matrixScale);
        rotation && matrix.multiply(rotationMatrix);
        position && matrix.setPosition(matrixPos);

        matrix.toArray(matrix_buffer.array, index * 16);

        index++;
    }

    return matrix_buffer;

}

const matrixEuler = new THREE.Euler();
const matrixPos   = new THREE.Vector3();
const matrixScale = new THREE.Vector3();

export function useInstanceBuffer(objects){
    // Here execution is in the context of parent component
    return function(prev_buffer = empty_matrix_buffer){
        const instanceBuffer = useMemo( () => new OrbitsInstanceBuffer([]), [] );
        instanceBuffer.set(objects, prev_buffer);
        return instanceBuffer.matrix_buffer;
    }
}


// Too far and scaled to 0
const hidden_object = { position: {x: 2000000, y: 2000000, z: 2000000 }, scale: { x: 0, y: 0, z: 0 } };

class OrbitsInstanceBuffer {
    
    constructor(objects){
        this.objects = [];
        this.createMatrixBuffer(0);
    }


    set(objects){

        // this.objects is prev_objects
        const new_size = objects.length;
        const old_size = this.objects?.length || 0;

        const prev_objects = this.objects;
        this.objects       = objects.slice();

        let new_matrix_array;
        const old_matrix_array = this.matrix_array;

        let changed = false;

        if(new_size != old_size) { // Copy old matrix_array into bigger array
            this.createMatrixBuffer(new_size);
            new_matrix_array = this.matrix_buffer.array;
            new_matrix_array.set(
                new_size > old_size ? old_matrix_array : old_matrix_array.slice(0, new_size),
                0
            );
            changed = true;
        }
        else {
            new_matrix_array = this.matrix_array;
        }



        let obj;
        const len = objects.length;
        for(let i = 0; i < len; i++){
            obj = objects[i];
            // if(obj === prev_objects[i]) continue; // !! Skips same reference, but not apply changed values
            if(!obj) obj = hidden_object;

            changed = true;

            const matrix = new THREE.Matrix4();

            obj.position ? matrixPos   .set( obj.position.x, obj.position.y, obj.position.z        ) : matrixPos   .set(0, 0, 0);
            obj.rotation ? matrixEuler .set( obj.rotation.x, obj.rotation.y, obj.rotation.z, "XYZ" ) : matrixEuler .set(0, 0, 0, "XYZ");
            obj.scale    ? matrixScale .set( obj.scale.x,    obj.scale.y,    obj.scale.z           ) : matrixScale .set(1, 1, 1);

            const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(matrixEuler);

            obj.scale    && matrix.scale(matrixScale);
            obj.rotation && matrix.multiply(rotationMatrix);
            obj.position && matrix.setPosition(matrixPos);
    
            matrix.toArray(new_matrix_array, i * 16);

        }

        if(changed) this.matrix_buffer.state = {};
        
    }






    createMatrixBuffer(n){
        this.matrix_array  = new Float32Array( n * 16 );
        this.matrix_buffer = new THREE.InstancedBufferAttribute(this.matrix_array, 16).setUsage(THREE.DynamicDrawUsage);
        this.matrix_buffer.state = {};
    }
}