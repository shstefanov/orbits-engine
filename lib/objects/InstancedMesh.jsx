import React, { useMemo, useState } from "react";
import * as THREE         from "three";
import Mesh from "../objects/Mesh";


export default function InstancedMesh({ children, ...props }){

    const [ mesh, setMesh ] = useState(null);

    const instanceMatrix = useMemo( () => {
        const buffer = createInstanceMatrix(props.instances, mesh?.instanceMatrix);
        buffer.sate = props.instances.state;
        return buffer;
    }, [ props.instances, props.instances.length, props.instances.state ] );

    return <Mesh {...props}
        instanceMatrix = { instanceMatrix         }
        instanceCount  = { props.instances.length }
        MeshPrototype  = { THREE.InstancedMesh    }
        onCreate       = { setMesh                }
    >{children}</Mesh>;
}


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

const defaults = { x: 0, y: 0, z: 0 };
