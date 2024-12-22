import { useEffect } from "react";
import createMeshManager from "./createMeshManager.js";

import { Vector3 } from "three";

function emptyUseEffect0(){ useEffect(() => {}, [])      }
function emptyUseEffect1(){ useEffect(() => {}, [1])     }
function emptyUseEffect3(){ useEffect(() => {}, [0,0,0]) }
function emptyUseEffect4(){ useEffect(() => {}, [0,0,0,0]) }
function emptyUseEffect6(){ useEffect(() => {}, [0,0,0,0,0,0]) }
function emptyUseEffect7(){ useEffect(() => {}, [0,0,0,0,0,0,0]) }

export default function createCamerahManager(camera, props, canvas, initialized){

    // Will be called first before mesh is created
    // We need to follow React convention and will keep
    // number and order of hooks by setting up empty
    // placeholders

    // Initialized flag is passed only at the beginning,
    // so we will break if this is the case
    if(initialized) return;

    // const { position, rotation, scale, lookAt } = props;

    let effects = [];

    if(props.hasOwnProperty("zoom")){
        if(!camera) effects.push(emptyUseEffect1);
        else        effects.push( props => useEffect(() => {
            camera.zoom = props.zoom;
            camera.updateProjectionMatrix();
            camera.render();
        }, [props.zoom]));
    }

    if(props.hasOwnProperty("up")){
        if(!camera) effects.push(emptyUseEffect3);
        else        effects.push( ({up}) => useEffect(() => {
            camera.up.set(up.x, up.y, up.z);
            camera.updateProjectionMatrix();
            camera.render();
        }, [up.x, up.y, up.z]));
    }

    if(props.hasOwnProperty("near")){
        if(!camera) effects.push(emptyUseEffect1);
        else        effects.push( ({near}) => useEffect(() => {
            camera.near = near;
            camera.updateProjectionMatrix();
            camera.render();
        }, [near]));
    }

    if(props.hasOwnProperty("far")){
        if(!camera) effects.push(emptyUseEffect1);
        else        effects.push( ({far}) => useEffect(() => {
            camera.far = far;
            camera.updateProjectionMatrix();
            camera.render();
        }, [far]));
    }

    if(props.hasOwnProperty("fov")){
        if(!camera) effects.push(emptyUseEffect1);
        else        effects.push( ({fov}) => useEffect(() => {
            camera.fov = fov;
            camera.updateProjectionMatrix();
            camera.render();
        }, [fov]));
    }

    if(props.hasOwnProperty("aspect")){
        if(!camera) effects.push(emptyUseEffect1);
        else        effects.push( ({aspect}) => useEffect(() => {
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
            camera.render();
        }, [aspect]));
    }


    if(props.controlType === "orbit-controls"){

        // TODO: Skip if externally managed attrs are provided without
        // onUpdate listener
        if(!camera) effects.unshift(emptyUseEffect1);
        else effects.unshift( ({ onUpdate, ...props }) => useEffect(() => {

            let action = null;

            const {
                // azimuthAngle = camera.userData.azimuthAngle || 0,
                // polarAngle   = camera.userData.polarAngle   || 0,
                rotateSpeed  = 1,
                panSpeed     = 1,
                scrollSpeed  = 1,
            } = props;

            function rotateHandler(event){
                const anchor      = { x: event.pageX, y: event.pageY };
                const angleAnchor = {
                    azimuthAngle: camera.userData.azimuthAngle || 0,
                    polarAngle:   camera.userData.polarAngle   || 0,
                };

                function computeAngles(event){
                    return {
                        azimuthAngle: ((rotateSpeed * (event.pageX - anchor.x)) / 300) + angleAnchor.azimuthAngle,
                        polarAngle:   ((rotateSpeed * (event.pageY - anchor.y)) / 300) + angleAnchor.polarAngle,
                    }
                }

                let moveListener;
                
                // No props, entirely internally managed
                if(!props.hasOwnProperty("azimuthAngle") && !props.hasOwnProperty("polarAngle")){
                    moveListener = e => {
                        const result = computeAngles(e);
                        Object.assign( camera.userData, result );
                        applyOrbitPosition( camera, props );
                        // Anyway, try for props.onUpdate
                        onUpdate && onUpdate({ ...camera.userData, ...result }, camera);
                     }
                }
                else if(onUpdate){
                    moveListener = e => {
                        const result = computeAngles(e);
                        Object.assign( camera.userData, result );
                        onUpdate({ ...camera.userData, ...result }, camera);
                    }
                }
                else {
                    canvas.removeEventListener("mousedown", mousedownListener);
                    throw new Error("Seems like 'azimuthAngle' and/or 'polarAngle' is externally managed, but no 'onUpdate' listener is provided ");
                }

                const endListener = e => {
                    action = null;
                    moveListener(e);
                    window.removeEventListener("mouseup",    endListener);
                    window.removeEventListener("mouseleave", endListener);
                    window.removeEventListener("mousemove",  moveListener);
                };
                
                
                window.addEventListener("mouseup",    endListener);
                window.addEventListener("mouseleave", endListener);
                window.addEventListener("mousemove",  moveListener);

            }

            function panningHandler(event){
                
                event.preventDefault();

                const anchor = { x: event.pageX, y: event.pageY };
                // TODO - cancel panning when "follow" is active
                const targetAnchor = new Vector3(camera.userData.target.x, camera.userData.target.y, camera.userData.target.z);
                // const localZ = (new Vector3()).subVectors(targetAnchor, camera.position).normalize();
                const localX = camera.localToWorld(new Vector3(-1, 0, 0)).sub(camera.position);
                const localY = camera.localToWorld(new Vector3( 0, 1, 0)).sub(camera.position);

                function moveListener(event){
                    const diff = {
                        x: ((event.pageX - anchor.x)/2500) * props.panSpeed * (camera.userData.distance),
                        y: ((event.pageY - anchor.y)/2500) * props.panSpeed * (camera.userData.distance),
                    };

                    const newTarget = targetAnchor.clone()
                        .add( localX.clone().multiplyScalar(diff.x) )
                        .add( localY.clone().multiplyScalar(diff.y) );

                    const {x, y, z} = newTarget;

                    camera.userData.target = {x, y, z};

                    const newProps = { ...camera.userData };

                    onUpdate  && onUpdate( newProps, camera);
                    !onUpdate && applyOrbitPosition(camera, newProps);

                }



                const endListener = e => {
                    action = null;
                    moveListener(e);
                    window.removeEventListener("mouseup",    endListener);
                    window.removeEventListener("mouseleave", endListener);
                    window.removeEventListener("mousemove",  moveListener);
                };
                
                window.addEventListener("mouseup",    endListener);
                window.addEventListener("mouseleave", endListener);
                window.addEventListener("mousemove",  moveListener);
            }

            function scrollHandler(event){
                event.preventDefault();
                const direction = event.deltaY > 0 ? 1 : -1;

                const diff = ( (camera.userData.scrollSpeed * camera.userData.distance ) / 36 ) * direction;

                const distance = Math.min(
                              camera.userData.maxDistance || 1000,
                    Math.max( camera.userData.minDistance || 10,     camera.userData.distance + diff)
                );

                const newProps = { ...camera.userData, distance };

                onUpdate  && onUpdate( newProps, camera);
                !onUpdate && applyOrbitPosition(camera, newProps);
            }

            const mousedownListener = e => {
                if(action) return;
                switch (e.button){
                    case 0: { rotateHandler(e);  break; }
                    case 2: { panningHandler(e); break; }
                }
            }

            const contextMenuListener = e => e.preventDefault();
            canvas.addEventListener("mousedown",   mousedownListener   );
            canvas.addEventListener("contextmenu", contextMenuListener );
            canvas.addEventListener("mousewheel",  scrollHandler );

            return () => {
                canvas.removeEventListener("mousedown",   mousedownListener   );
                canvas.removeEventListener("contextmenu", contextMenuListener );
                canvas.removeEventListener("mousewheel",  scrollHandler       );
            };
        }, [true]) );

        if(!camera) effects.push(() => useEffect(() => {}, Array(13)));
        else effects.push( (props) => useEffect(() => {
            Object.assign(camera.userData, props);
            applyOrbitPosition(camera, props);
        }, [
            
            props.follow, props.target?.x, props.target?.y, props.target?.z,
            
            props.azimuthAngle, props.polarAngle, props.distance, // The values
            
            // And the limits
            props.minAzimuthAngle, props.maxAzimuthAngle,
            props.minPolarAngle,   props.maxPolarAngle,
            props.minDistance,     props.maxDistance,
        ]));
    }

    else if(props.controlType === "mouse-direction"){

    }

    // This will only handle position, rotation/lookAt
    else return createMeshManager(camera, props, initialized);



    let ___effects = false && [

        // position and lookAt together should have own behavior
        position && props.hasOwnProperty("lookAt") && (
            !mesh ? emptyUseEffect6 : (({ lookAt, position: { x, y, z }}) => useEffect( () => {
                mesh.position.set(x, y, z);
                mesh.lookAt(lookAt.x, lookAt.y, lookAt.z);
                mesh.render();
            }, [x, y, z, lookAt.x, lookAt.y, lookAt.z]))
        ),

        // Position without lookAt
        position && !props.hasOwnProperty("lookAt") && (
            !mesh ? emptyUseEffect3 : (({ position: { x, y, z }}) => useEffect( () => {
                mesh.position.set(x, y, z);
                mesh.render();
            }, [x, y, z]))
        ),

        // If we have lookAt, we should ignore rotation
        (rotation && !props.hasOwnProperty("lookAt")) && ( 
            !mesh ? emptyUseEffect3 : (({ rotation: { x, y, z }}) => useEffect( () => {
                mesh.rotation.set(x, y, z);
                mesh.render();
            }, [x, y, z]))
        ),

        typeof scale === "number" && (
            !mesh ? emptyUseEffect1: (({ scale }) => useEffect( () => {
                mesh.scale.set(scale, scale, scale);
                mesh.render();
            }, [scale]))
        ),

        typeof scale === "object" && (
            !mesh ? emptyUseEffect3 : (({ scale: { x, y, z }}) => useEffect( () => {
                mesh.scale.set(x, y, z);
                mesh.render();
            }, [x, y, z]))
        ),

        props.hasOwnProperty("lookAt") && !position && (
            !mesh ? emptyUseEffect3 : (({ lookAt }) => useEffect( () => {
                if(!lookAt) return;
                mesh.lookAt(lookAt.x, lookAt.y, lookAt.z);
                mesh.render();
            }, [lookAt?.x, lookAt?.y, lookAt?.z]))
        ),

    ].filter( e => e ); // Some props do not have function and are falsy value

    return !effects.length ? null : {
        set: function(props){
            // this = mesh
            // this.render() -> scene.render()
            for(let effect of effects) effect(props);
        }
    }

}








function applyOrbitPosition(camera, props){
    
    const {
        target, follow,
        azimuthAngle = camera.userData.azimuthAngle || 0,
        polarAngle   = camera.userData.polarAngle   || 0,
        distance, 
        maxPolarAngle = Math.PI / 2, minPolarAngle = -(Math.PI/2), maxAzimuthAngle = Infinity, minAzimuthAngle = -Infinity,
        minDistance = 10, maxDistance = 1000,
    } = props;

    if(follow){
        // TODO: Find the object and override target variable
    }

    // console.log("applyOrbitPosition", azimuthAngle, polarAngle);

    const dist    = Math.max(minDistance,     Math.min(maxDistance,     distance     ));
    const azimuth = Math.max(minAzimuthAngle, Math.min(maxAzimuthAngle, azimuthAngle ));
    const polar   = Math.max(minPolarAngle,   Math.min(maxPolarAngle,   polarAngle   ));

    // Get orientation
    const newPos = {
        x: Math.sin( azimuth ),
        y: Math.cos( azimuth ),
        z: Math.tan( polar   ),
    };

    // Normalize it, multiply by distance and add target
    const length = Math.sqrt((newPos.x ** 2)+(newPos.y ** 2)+(newPos.z ** 2));
    newPos.x = ((newPos.x/length) * dist) + target.x;
    newPos.y = ((newPos.y/length) * dist) + target.y;
    newPos.z = ((newPos.z/length) * dist) + target.z;

    camera.position.set(newPos.x, newPos.y, newPos.z);
    camera.lookAt(target.x, target.y, target.z);
    camera.render();



}