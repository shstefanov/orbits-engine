import { useEffect } from "react";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";

function emptyUseEffect1(){ useEffect(() => {}, [1])     }
function emptyUseEffect3(){ useEffect(() => {}, [0,0,0]) }
function emptyUseEffect4(){ useEffect(() => {}, [0,0,0,0]) }
function emptyUseEffect6(){ useEffect(() => {}, [0,0,0,0,0,0]) }
function emptyUseEffect7(){ useEffect(() => {}, [0,0,0,0,0,0,0]) }

export default function createCamerahManager(camera, props, initialized){

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
            camera.render();
        }, [props.zoom]));
    }

    if(props.hasOwnProperty("up")){
        if(!camera) effects.push(emptyUseEffect3);
        else        effects.push( ({up}) => useEffect(() => {
            camera.up.set(up.x, up.y, up.z);
            camera.render();
        }, [up.x, up.y, up.z]));
    }



    if(props.hasOwnProperty("target") || props.hasOwnProperty("follow")){
        if(!camera) effects.push(emptyUseEffect7);
        else effects.push( ({
            target, follow, azimuthAngle, polarAngle, distance, 
            maxPolarAngle = Math.PI / 2, minPolarAngle = -(Math.PI/2), maxAzimuthAngle = Infinity, minAzimuthAngle = -Infinity,
            minDistance = 1, maxDistance = 100
        }) => useEffect(() => {
            
            
            if(follow){
                // TODO: Find the object and override target variable
            }

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

        }, [follow, target?.x, target?.y, target?.z, azimuthAngle, polarAngle, distance]));
    }

    else if(props.hasOwnProperty("target")){

    }





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