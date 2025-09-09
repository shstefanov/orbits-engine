import * as THREE          from "three";
import { colorAttributes } from "./createMaterialManager";


// Handles transition and period
export default function createTransitionManager( mesh, props, renderer, attributes, type, timer ){

    if(!mesh) return;

    let effects = [];

    const { duration, base = Date.now(), timingFunction = "LINEAR", ...rest } = attributes;

    let { position, rotation, lookAt, scale, ...materialProps } = rest;

    if(scale && typeof scale[0] === "number") scale = scale.map( n => ({ x: n, y: n, z: n }) );

    
    if(position) effects.push( createVector3Lerp ( mesh, position, mesh.position ) );
    if(rotation) effects.push( createEulerLerp   ( mesh, rotation, mesh.rotation ) );
    if(scale)    effects.push( createVector3Lerp ( mesh, scale,    mesh.scale    ) );
    if(lookAt)   effects.push( createLookAtLerp  ( mesh, lookAt,   mesh          ) );

    for(let propName in materialProps){
        if(propName in colorAttributes) effects.push(createColorMaterialLerp   (mesh, materialProps[propName], mesh.material[propName], mesh.material));
        else                            effects.push(createNumericMaterialLerp (mesh, materialProps[propName], propName, mesh.material));
    }


    mesh.transitions = mesh.transitions || new Set();

    function handleState(state, phase, cancel, finished = false){
        t.finished = finished;
        t.phase = phase;
		for(let fn of effects) fn(phase);
        renderer.render();
	}

    if(!effects.length) return;

    const options = { duration, base, timing_function: timingFunction };
    
    if(type === "relPeriod")     options.base = attributes.base || timer.state.rel_now;
    if(type === "relTransition") options.base = attributes.base || timer.state.rel_now;
    if(type === "transition")    options.base = attributes.base || timer.state.now;
    
    const t = timer[type](options, handleState);
    mesh.transitions.add(t);
    mesh.transitions.cancelAll = () => { for(let [{cancel}] of mesh.transitions.entries()) cancel(); }

    // Override cancel
    const { cancel } = t;
    t.cancel = () => {
        cancel();
        t.canceled = true;
        mesh.transitions.delete(t);
    };

    return t;
    
}




function createVector3Lerp(mesh, [ b, e ], target){
    const start = new THREE.Vector3(b.x, b.y, b.z);
    const end   = new THREE.Vector3(e.x, e.y, e.z);
    return phase => target.lerpVectors( start, end, phase );
}

function createLookAtLerp( mesh, [ b, e ] ){
    const start = new THREE.Vector3(b.x, b.y, b.z);
    const end   = new THREE.Vector3(e.x, e.y, e.z);
    const vec   = new THREE.Vector3();
    return phase => {
        vec.lerpVectors(start, end, phase);
        mesh.lookAt(vec.x, vec.y, vec.z);
    };
}

function createEulerLerp(mesh, [ b, e ], target){
    const start = new THREE.Vector3(b.x, b.y, b.z);
    const end   = new THREE.Vector3(e.x, e.y, e.z);
    const vec   = start.clone();
    return phase => {
        vec.lerpVectors(start, end, phase);
        target.set( vec.x, vec.y, vec.z, target.order );
    };
}

function createColorMaterialLerp(mesh, [b, e], color, material){
    const start = new THREE.Color(b);
    const end   = new THREE.Color(e);
    return phase => {
        color.lerpColors( start, end, phase );
        material.needsUpdate = true;
    }
}

function createNumericMaterialLerp(mesh,  [start, end], propName, material){
    const diff = end - start;
    return phase => {
        material[propName] = start + diff * phase;
        material.needsUpdate = true;
    }
}
