import { useEffect } from "react";
import createMeshManager from "./createMeshManager.js";

import { Vector3 } from "three";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";

function emptyUseEffect0(){ useEffect(() => {}, [])      }
function emptyUseEffect1(){ useEffect(() => {}, [{}])     }
function emptyUseEffect3(){ useEffect(() => {}, [{},{},{}]) }
function emptyUseEffect4(){ useEffect(() => {}, [{},{},{},{}]) }
function emptyUseEffect6(){ useEffect(() => {}, [{},{},{},{},{},{}]) }
function emptyUseEffect7(){ useEffect(() => {}, [{},{},{},{},{},{},{}]) }

export default function createOrthographicCamerahManager(camera, props, canvas, initialized){

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
        else        effects.push( ({zoom}) => useEffect(() => {
            camera.zoom = zoom;
            camera.updateProjectionMatrix();
            camera.render();
        }, [zoom]));
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


    if(props.controlType === "orbit-controls"){

        // TODO: Skip if externally managed attrs are provided without
        // onUpdate listener
        if(!camera) effects.unshift(emptyUseEffect1);
        else effects.unshift( ({ onUpdate, ...props }) => useEffect(() => {

            let action = null;

            function rotateHandler(event){
                const anchor      = { x: event.pageX, y: event.pageY };
                const angleAnchor = {
                    azimuthAngle: camera.userData.azimuthAngle || 0,
                    polarAngle:   camera.userData.polarAngle   || 0,
                };

                function computeAngles(event){

                    const { rotateSpeed = 1 } = camera.userData;

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

                const localX = camera.localToWorld(new Vector3(-1, 0, 0)).sub(camera.position);
                const localY = camera.localToWorld(new Vector3( 0, 1, 0)).sub(camera.position);

                function moveListener(event){

                    const { panSpeed = 1 } = camera.userData;

                    const diff = {
                        x: ( ( (event.pageX - anchor.x) / (camera.userData.zoom || 1 ) ) * -1) * panSpeed,
                        y: ( ( (event.pageY - anchor.y) / (camera.userData.zoom || 1 ) ) * -1) * panSpeed,
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
                const diff = (event.deltaY > 0 ? -0.1 : 0.1) * (camera.userData.zoom || camera.zoom);
                const newZoom = (camera.userData.zoom) + diff;
                if(onUpdate) onUpdate({ ...camera.userData, zoom: newZoom});
            };

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
        else effects.push( (props)  => useEffect(() => {
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
    else createMeshManager(camera, props, initialized, effects);


    return !effects.length ? null : {
        set: function(props){
            camera && Object.assign(camera.userData, props);
            for(let effect of effects) effect(props);
        }
    }

}








function applyOrbitPosition(camera, props){

    const {
        target, follow,
        azimuthAngle = camera.userData.azimuthAngle || 0,
        polarAngle   = camera.userData.polarAngle   || 0,
        distance     = 100, 
        maxPolarAngle = Math.PI / 2, minPolarAngle = -(Math.PI/2), maxAzimuthAngle = Infinity, minAzimuthAngle = -Infinity,
        minDistance = 10, maxDistance = 1000,
    } = props;

    if(follow){
        // TODO: Find the object and override target variable
    }

    const dist    = Math.max(minDistance,     Math.min(maxDistance,     distance     ));
    const azimuth = Math.max(minAzimuthAngle, Math.min(maxAzimuthAngle, azimuthAngle ));
    const polar   = Math.max(minPolarAngle,   Math.min(maxPolarAngle,   polarAngle   ));

    // Get orientation - offset with PI to get initial X to the right, Y to the front
    const newPos = {
        x: Math.sin( azimuth + Math.PI ),
        y: Math.cos( azimuth + Math.PI ),
        z: Math.tan( polar             ),
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