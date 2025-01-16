import { useEffect } from "react";

function emptyUseEffect1(){ useEffect(() => {}, [0])     }
function emptyUseEffect2(){ useEffect(() => {}, [0, 0])  }
function emptyUseEffect3(){ useEffect(() => {}, [0,0,0]) }
function emptyUseEffect6(){ useEffect(() => {}, [0,0,0,0,0,0]) }

function applyNow(fn){ fn() }
const skip = { set: () =>{} };

export default function createMeshManager(mesh, props, renderer, initialized, effects = []){

    // Will be called first before mesh is created
    // We need to follow React convention and will keep
    // number andfor(let effect of effects) effect(props, apply); order of hooks by setting up empty
    // placeholders

    // Initialized flag is passed only at the beginning,
    // so we will break if this is the case
    if(initialized) return;

    const { position, rotation, scale, lookAt, up } = props;
    for(let effect of effects) effect(props, apply);
    // position and lookAt together should have own behavior
    position && props.hasOwnProperty("lookAt") && effects.push(
        !mesh ? emptyUseEffect6 : (({ lookAt, position: { x, y, z }}, apply) => apply( () => {
            mesh.position.set(x, y, z);
            mesh.lookAt(lookAt.x, lookAt.y, lookAt.z);
            renderer.render();
        }, [x, y, z, lookAt.x, lookAt.y, lookAt.z]))
    );

    // Position without lookAt
    position && !props.hasOwnProperty("lookAt") && effects.push(
        !mesh ? emptyUseEffect3 : (({ position: { x, y, z }}, apply) => apply( () => {
            mesh.position.set(x, y, z);
            renderer.render();
        }, [x, y, z]))
    );

    // If we have lookAt, we should ignore rotation
    (rotation && !props.hasOwnProperty("lookAt")) && effects.push( 
        !mesh ? emptyUseEffect3 : (({ rotation: { x, y, z }}, apply) => apply( () => {
            mesh.rotation.set(x, y, z);
            renderer.render();
        }, [x, y, z]))
    );

    typeof scale === "number" && effects.push(
        !mesh ? emptyUseEffect1: (({ scale }, apply) => apply( () => {
            mesh.scale.set(scale, scale, scale);
            renderer.render();
        }, [scale]))
    );

    typeof scale === "object" && effects.push(
        !mesh ? emptyUseEffect3 : (({ scale: { x, y, z }}, apply) => apply( () => {
            mesh.scale.set(x, y, z);
            renderer.render();
        }, [x, y, z]))
    );

    typeof up === "object" && effects.push(
        !mesh ? emptyUseEffect3 : (({ up: { x, y, z }}, apply) => apply( () => {
            mesh.up.set(x, y, z);
            renderer.render();
        }, [x, y, z]))
    );

    // Only lookAt, without position
    props.hasOwnProperty("lookAt") && !position && effects.push(
        !mesh ? emptyUseEffect3 : (({ lookAt }, apply) => apply( () => {
            if(!lookAt) return;
            mesh.lookAt(lookAt.x, lookAt.y, lookAt.z);
            renderer.render();
        }, [lookAt?.x, lookAt?.y, lookAt?.z]))
    );

    props.hasOwnProperty("animation") && effects.push(
        !mesh ? emptyUseEffect1 : (({ animation, animationFade = 0 }, apply) => apply( () => {
            mesh.currentClip && (animationFade ? mesh.currentClip.fadeOut(animationFade) : mesh.currentClip.stop());
            mesh.currentClip = mesh.animClips[animation] || null;
            mesh.currentClip && mesh.currentClip.reset();
            mesh.currentClip && (animationFade ? mesh.currentClip.fadeIn(animationFade) : mesh.currentClip.play());
        }, [animation]))
    );

    return !effects.length ? skip : {
        set: function(props, apply = applyNow){
            for(let effect of effects) effect(props, apply);
        }
    }

}