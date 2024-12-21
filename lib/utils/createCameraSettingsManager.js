import { useEffect } from "react";

function emptyUseEffect1(){ useEffect(() => {}, [1]) }

export default function createCameraManager(camera, props, initialized){

    // Will be called first before camera is created
    // We need to follow React convention and will keep
    // number and order of hooks by setting up empty
    // placeholders

    // Initialized flag is passed only at the beginning,
    // so we will break if this is the case
    if(initialized) return;

    const { fov, aspect, near, far, zoom } = props;

    const effects = [
        
        // camera.fov
        typeof fov === "number" && (
            !camera ? emptyUseEffect1 : (({ fov }) => useEffect( () => {
                camera.fov = fov;
                camera.updateProjectionMatrix();
                camera.render();
            }, [ fov ]))
        ),

        // camera.aspect
        typeof aspect === "number" && ( 
            !camera ? emptyUseEffect1 : (({ aspect }) => useEffect( () => {
                mesh.aspect = aspect;
                camera.updateProjectionMatrix();
                camera.render();
            }, [ aspect ]))
        ),

        // camera.near
        typeof near === "number" && (
            !camera ? emptyUseEffect1: (({ near }) => useEffect( () => {
                camera.near = near;
                camera.updateProjectionMatrix();
                camera.render();
            }, [ near ]))
        ),

        // camera.far
        typeof far === "number" && (
            !camera ? emptyUseEffect1: (({ far }) => useEffect( () => {
                camera.far = far;
                camera.updateProjectionMatrix();
                camera.render();
            }, [ far ]))
        ),

        // camera.zoom
        typeof zoom === "number" && (
            !camera ? emptyUseEffect1: (({ zoom }) => useEffect( () => {
                camera.zoom = zoom;
                camera.updateProjectionMatrix();
                camera.render();
            }, [ zoom ]))
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