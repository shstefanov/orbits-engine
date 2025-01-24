import { useEffect } from "react";
import createMeshManager from "./createMeshManager.js";

import { Vector3 } from "three";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const p = {}, v = () => {};

function uePlaceholder0(){ useEffect(v, []) }
function uePlaceholder1(){ useEffect(v, [p]) }
function uePlaceholder3(){ useEffect(v, [p,p,p]) }
function uePlaceholder4(){ useEffect(v, [p,p,p,p]) }
function uePlaceholder6(){ useEffect(v, [p,p,p,p,p,p]) }
function uePlaceholder7(){ useEffect(v, [p,p,p,p,p,p,p]) }

function applyNow(fn){ fn() }
const skip = { set: () =>{} };

export default function createCamerahManager(camera, props, renderer, initialized){

    // Will be called first before mesh is created
    // We need to follow React convention and will keep
    // number and order of hooks by setting up empty
    // placeholders

    // Initialized flag is passed only at the beginning,
    // so we will break if this is the case
    if(initialized) return;

    let effects = [];

    const canvas = renderer.getCanvas();

    if(props.hasOwnProperty("zoom")){
        if(!camera) effects.push(uePlaceholder1);
        else        effects.push( (props, apply) => apply(() => {
            camera.zoom = props.zoom;
            camera.updateProjectionMatrix();
            renderer.render();
        }, [props.zoom]));
    }

    if(props.hasOwnProperty("up")){
        if(!camera) effects.push(uePlaceholder3);
        else        effects.push( ({up}, apply) => apply(() => {
            camera.up.set(up.x, up.y, up.z);
            camera.updateProjectionMatrix();
            renderer.render();
        }, [up.x, up.y, up.z]));
    }

    if(props.hasOwnProperty("near")){
        if(!camera) effects.push(uePlaceholder1);
        else        effects.push( ({near}, apply) => apply(() => {
            camera.near = near;
            camera.updateProjectionMatrix();
            renderer.render();
        }, [near]));
    }

    if(props.hasOwnProperty("far")){
        if(!camera) effects.push(uePlaceholder1);
        else        effects.push( ({far}, apply) => apply(() => {
            camera.far = far;
            camera.updateProjectionMatrix();
            renderer.render();
        }, [far]));
    }

    if(props.hasOwnProperty("fov")){
        if(!camera) effects.push(uePlaceholder1);
        else        effects.push( ({fov}, apply) => apply(() => {
            camera.fov = fov;
            camera.updateProjectionMatrix();
            renderer.render();
        }, [fov]));
    }

    if(props.hasOwnProperty("aspect")){
        if(!camera) effects.push(uePlaceholder1);
        else        effects.push( ({aspect}, apply) => apply(() => {
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
            renderer.render();
        }, [aspect]));
    }

    if(props.controlType === "orbit-controls"){

        // TODO: Skip if externally managed attrs are provided without
        // onUpdate listener
        if(!camera) effects.unshift(uePlaceholder1);
        else effects.unshift( ({ onUpdate, ...props }, apply) => apply(() => {
            let action = null;

            function rotateHandler(event){
                const anchor      = { x: event.pageX, y: event.pageY };
                const angleAnchor = {
                    azimuthAngle: camera.userData.azimuthAngle || 0,
                    polarAngle:   camera.userData.polarAngle   || 0,
                };

                function computeAngles(event){

                    const {
                        rotateSpeed = 1,
                        maxPolarAngle = Math.PI /  2,
                        minPolarAngle = Math.PI / -2,
                        maxAzimuthAngle =  Infinity,
                        minAzimuthAngle = -Infinity,
                    } = camera.userData;

                    const result =  {
                        azimuthAngle: ((rotateSpeed * (event.pageX - anchor.x)) / 300) + angleAnchor.azimuthAngle,
                        polarAngle:   ((rotateSpeed * (event.pageY - anchor.y)) / 300) + angleAnchor.polarAngle,
                    };

                    if(result.azimuthAngle >= maxAzimuthAngle) { angleAnchor.azimuthAngle = maxAzimuthAngle; anchor.x = event.pageX; }
                    if(result.azimuthAngle <= minAzimuthAngle) { angleAnchor.azimuthAngle = minAzimuthAngle; anchor.x = event.pageX; }
                    if(result.polarAngle   >= maxPolarAngle)   { angleAnchor.polarAngle   = maxPolarAngle;   anchor.y = event.pageY; }
                    if(result.polarAngle   <= minPolarAngle)   { angleAnchor.polarAngle   = minPolarAngle;   anchor.y = event.pageY; }

                    result.azimuthAngle = Math.min(maxAzimuthAngle, Math.max(minAzimuthAngle, result.azimuthAngle ));
                    result.polarAngle   = Math.min(maxPolarAngle,   Math.max(minPolarAngle,   result.polarAngle   ));

                    return result;
                }

                let moveListener;
                
                // No props, entirely internally managed
                if(!props.hasOwnProperty("azimuthAngle") && !props.hasOwnProperty("polarAngle")){
                    moveListener = e => {
                        const result = computeAngles(e);
                        camera.userData = Object.freeze({ ...camera.userData, ...result });
                        applyOrbitPosition( renderer, camera, camera.userData );
                        // Anyway, try for props.onUpdate
                        onUpdate && onUpdate(camera.userData, camera);
                     }
                }
                else if(onUpdate){
                    moveListener = e => {
                        const result = computeAngles(e);
                        camera.userData = Object.freeze({ ...camera.userData, ...result });
                        onUpdate(camera.userData, camera);
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

                    const { panSpeed = 1 } = camera.userData;

                    const diff = {
                        x: ((event.pageX - anchor.x)/2500) * panSpeed * (camera.userData.distance),
                        y: ((event.pageY - anchor.y)/2500) * panSpeed * (camera.userData.distance),
                    };

                    const newTarget = targetAnchor.clone()
                        .add( localX.clone().multiplyScalar(diff.x) )
                        .add( localY.clone().multiplyScalar(diff.y) );

                    const {x, y, z} = newTarget;

                    camera.userData = Object.freeze({ ...camera.userData, target: newTarget });
                    onUpdate  && onUpdate( camera.userData, camera);
                    !onUpdate && applyOrbitPosition(renderer, camera, camera.userData);

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

                const { scrollSpeed = 1 } = camera.userData;

                const diff = ( (scrollSpeed * camera.userData.distance ) / 36 ) * direction;

                const distance = Math.min(
                              camera.userData.maxDistance || 1000,
                    Math.max( camera.userData.minDistance || 10,     camera.userData.distance + diff)
                );

                camera.userData = Object.freeze({ ...camera.userData, distance });
                onUpdate  && onUpdate( camera.userData, camera);
                !onUpdate && applyOrbitPosition(renderer, camera, camera.userData);
            }

            const mousedownListener = event => {
                if(action || event.defaultPrevented) return;
                switch (event.button){
                    case 0: { rotateHandler(event);  break; }
                    case 2: { panningHandler(event); break; }
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
        else effects.push( (props, apply)  => apply(() => {
            applyOrbitPosition(renderer, camera, props);
        }, [
            props.follow, props.target?.x, props.target?.y, props.target?.z,
            props.azimuthAngle, props.polarAngle, props.distance, // The values
            
            // And the limits
            props.minAzimuthAngle, props.maxAzimuthAngle,
            props.minPolarAngle,   props.maxPolarAngle,
            props.minDistance,     props.maxDistance,
        ]));
    }

    else if(props.controlType === "mouse-lock"){
        let controls, goForward, goRight;

        props.hasOwnProperty("rotation") && effects.push(
            !camera ? uePlaceholder4 : (({rotation: { x, y, z, order = camera.rotation.order }}, apply) => apply( () => {
                camera.rotation.set(x, y, z, order);
                renderer.render();
            }, [ x, y, z, order ]))
        );

        props.hasOwnProperty("position") && effects.push(
            !camera ? uePlaceholder3 : (({position: {x, y, z}}, apply) => apply( () => {
                camera.position.set( x, y, z );
                renderer.render();
            }, [ x, y, z ]))
        );
        
        if(!camera) effects.push(uePlaceholder0);
        else        effects.push( (props, apply) => apply(() => {

            const canvas = renderer.getCanvas();
            // Setup pointer lock here
            controls = new PointerLockControls( camera, document.body );
            camera.direction = new THREE.Vector3();
            camera.update = () => renderer.render();

            let lockListener;
            controls.addEventListener( 'lock', lockListener =  function () {
                camera.userData.onLock?.call(window, camera);
            });
            
            let unlockListener;
            controls.addEventListener( 'unlock', unlockListener = function () {
                camera.userData.onUnlock?.call(window, camera);
            });

            let changeListener;
            controls.addEventListener( 'change', changeListener = function (event) {
                controls.getDirection(camera.direction);
                camera.userData.onChange?.call(window, event, camera);
                if(!camera.userData.rotation) renderer.render();
            });

            let clickListener;
            canvas.addEventListener("click", clickListener =  () => {
                controls.lock();
            });

            return function(){
                goForward = null;
                goRight   = null;
                controls.unlock();
                canvas.removeEventListener("click", clickListener);
                controls.removeEventListener("lock", lockListener);
                controls.removeEventListener("unlock", unlockListener);
            }


        }, []));

        if(props.hasOwnProperty("minPolarAngle")){
            if(!camera) effects.push(uePlaceholder1);
            else        effects.push( ({minPolarAngle}, apply) => apply(() => {
                controls.minPolarAngle = minPolarAngle;
            }, [minPolarAngle]));
        }

        if(props.hasOwnProperty("maxPolarAngle")){
            if(!camera) effects.push(uePlaceholder1);
            else        effects.push( ({maxPolarAngle}, apply) => apply(() => {
                controls.maxPolarAngle = maxPolarAngle;
            }, [maxPolarAngle]));
        }

        if(props.hasOwnProperty("pointerSpeed")){
            if(!camera) effects.push(uePlaceholder1);
            else        effects.push( ({pointerSpeed}, apply) => apply(() => {
                controls.pointerSpeed = pointerSpeed;
            }, [pointerSpeed]));
        }








        if(props.hasOwnProperty("moveForward")){
            if(!camera) effects.push(uePlaceholder1);
            else {

                goForward = function goForward(){
                    if(camera.userData.moveForward){
                        const direction = controls.getDirection(camera.direction);
                        const forwardVec = direction.clone().multiplyScalar(camera.userData.moveForward);
                        // controls.moveForward(camera.userData.moveForward);
                        camera.position.add(forwardVec);
                        camera.userData.onChange?.call(window, controls, camera);
                        requestAnimationFrame(goForward);
                        if(!camera.userData.position) renderer.render();
                    }
                }
                effects.push( ({moveForward}, apply) => apply(() => {
                    moveForward && goForward();
                }, [!!moveForward]));
            }
        }

        if(props.hasOwnProperty("moveRight")){
            if(!camera) effects.push(uePlaceholder1);
            else {
                goRight = function goRight(){
                    if(camera.userData.moveRight){
                        const rightVec = camera.localToWorld(new THREE.Vector3(1, 0, 0))
                            .sub(camera.position)
                            .multiplyScalar(camera.userData.moveRight);
                        // controls.moveRight(camera.userData.moveRight);
                        camera.position.add(rightVec);
                        camera.userData.onChange?.call(window, controls, camera);
                        requestAnimationFrame(goRight);
                        if(!camera.userData.position) renderer.render();
                    }
                }
                effects.push( ({moveRight}, apply) => apply(() => {
                    moveRight && goRight();
                }, [!!moveRight]));
            }
        }




        
    }

    // This will only handle position, rotation/lookAt
    else createMeshManager(camera, props, initialized, effects);

    return !effects.length ? skip : {
        set: function(props, apply = applyNow){
            if(camera) camera.userData = props;
            for(let effect of effects) effect(props, apply);
        }
    }

}








function applyOrbitPosition(renderer, camera, props){

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
    renderer.render();



}