import { useEffect } from "react";

function emptyUseEffect1(){ useEffect(() => {}, [1])     }
function emptyUseEffect3(){ useEffect(() => {}, [0,0,0]) }
function emptyUseEffect6(){ useEffect(() => {}, [0,0,0,0,0,0]) }


export default function createMeshManager(mesh, props, initialized, effects = []){

    // Will be called first before mesh is created
    // We need to follow React convention and will keep
    // number and order of hooks by setting up empty
    // placeholders

    // Initialized flag is passed only at the beginning,
    // so we will break if this is the case
    if(initialized) return;

    const { position, rotation, scale, lookAt } = props;

    // position and lookAt together should have own behavior
    position && props.hasOwnProperty("lookAt") && effects.push(
        !mesh ? emptyUseEffect6 : (({ lookAt, position: { x, y, z }}) => useEffect( () => {
            mesh.position.set(x, y, z);
            mesh.lookAt(lookAt.x, lookAt.y, lookAt.z);
            mesh.render();
        }, [x, y, z, lookAt.x, lookAt.y, lookAt.z]))
    );

    // Position without lookAt
    position && !props.hasOwnProperty("lookAt") && effects.push(
        !mesh ? emptyUseEffect3 : (({ position: { x, y, z }}) => useEffect( () => {
            mesh.position.set(x, y, z);
            mesh.render();
        }, [x, y, z]))
    );

    // If we have lookAt, we should ignore rotation
    (rotation && !props.hasOwnProperty("lookAt")) && effects.push( 
        !mesh ? emptyUseEffect3 : (({ rotation: { x, y, z }}) => useEffect( () => {
            mesh.rotation.set(x, y, z);
            mesh.render();
        }, [x, y, z]))
    );

    typeof scale === "number" && effects.push(
        !mesh ? emptyUseEffect1: (({ scale }) => useEffect( () => {
            mesh.scale.set(scale, scale, scale);
            mesh.render();
        }, [scale]))
    );

    typeof scale === "object" && effects.push(
        !mesh ? emptyUseEffect3 : (({ scale: { x, y, z }}) => useEffect( () => {
            mesh.scale.set(x, y, z);
            mesh.render();
        }, [x, y, z]))
    );

    // Only lookAt, without position
    props.hasOwnProperty("lookAt") && !position && effects.push(
        !mesh ? emptyUseEffect3 : (({ lookAt }) => useEffect( () => {
            if(!lookAt) return;
            mesh.lookAt(lookAt.x, lookAt.y, lookAt.z);
            mesh.render();
        }, [lookAt?.x, lookAt?.y, lookAt?.z]))
    );


    return !effects.length ? null : {
        set: function(props){
            // this = mesh
            // this.render() -> scene.render()
            for(let effect of effects) effect(props);
        }
    }

}