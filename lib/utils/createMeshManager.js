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
    // number and for(let effect of effects) effect(props, apply);
    // order of hooks by setting up empty placeholders

    // Initialized flag is passed only at the beginning,
    // so we will break if this is the case
    if(initialized) return;

    const {
        position, rotation, scale, lookAt, up,
        points, rgbColors, rgbaColors
    } = props;
    for(let effect of effects) effect(props, apply);


    // Handle 'renderOrder' attribute if present
    props.hasOwnProperty("renderOrder") && effects.push(
        !mesh ? emptyUseEffect1 : (({ renderOrder }, apply) => apply( () => {
            mesh.renderOrder = renderOrder;
            renderer.render();
        }, [props.renderOrder]))
    );

    // Handle 'visible' attribute if present
    props.hasOwnProperty("visible") && effects.push(
        !mesh ? emptyUseEffect1 : (({ visible }, apply) => apply( () => {
            mesh.visible = visible;
            renderer.render();
        }, [props.visible]))
    );

    // If we have lookAt, we should ignore rotation
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
        !mesh ? emptyUseEffect3 : (({ rotation: { x, y, z, order = mesh.rotation.order }}, apply) => apply( () => {
            mesh.rotation.set(x, y, z, order);
            renderer.render();
        }, [x, y, z, order]))
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

    // That is when geometry is BufferGeometry
    props.hasOwnProperty("points") && effects.push(
        !mesh ? emptyUseEffect1 : (({ points }, apply) => apply( () => {
            const geometry = mesh.geometry;
            const buffer = new Float32Array(points.length * 3);
            for(let i = 0; i < points.length; i++) {
                const index = i * 3;
                const { x = 0, y = 0, z = 0 } = points[i];
                buffer[index]   = x;
                buffer[index+1] = y;
                buffer[index+2] = z;
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(buffer, 3));
            geometry.attributes.position.needsUpdate = true;
            renderer.render();
        }, [points]))
    );

    props.hasOwnProperty("rgbColors") && effects.push(
        !mesh ? emptyUseEffect1 : (({ points }, apply) => apply( () => {
            const geometry = mesh.geometry;
            const color_buffer = new Float32Array(rgbColors.length * 3);
            let index = 0;
            for(let { r = 0, g = 0, b = 0 } of rgbColors){
                color_buffer[ 3 * index     ] = r;
                color_buffer[ 3 * index + 1 ] = g;
                color_buffer[ 3 * index + 2 ] = b;
                index++;
            }
            geometry.setAttribute('color', new THREE.BufferAttribute(color_buffer, 3));
            geometry.attributes.color.needsUpdate = true;
            renderer.render();
        }, [rgbColors]))
    );

    props.hasOwnProperty("rgbaColors") && effects.push(
        !mesh ? emptyUseEffect1 : (({ points }, apply) => apply( () => {
            const geometry = mesh.geometry;
            const color_buffer = new Float32Array(rgbaColors.length * 4);
            let index = 0;
            for(let { r = 0, g = 0, b = 0, a = 0 } of rgbaColors){
                color_buffer[ 3 * index     ] = r;
                color_buffer[ 3 * index + 1 ] = g;
                color_buffer[ 3 * index + 2 ] = b;
                color_buffer[ 3 * index + 3 ] = a;
                index++;
            }
            geometry.setAttribute('color', new THREE.BufferAttribute(color_buffer, 4));
            geometry.attributes.color.needsUpdate = true;
            renderer.render();
        }, [rgbaColors]))
    );

    return !effects.length ? skip : {
        set: function(props, apply = applyNow){
            for(let effect of effects) effect(props, apply);
        }
    }

}


function rgbComponents( color,
    r = (color >> 16),
    g = ((color-(r*0x10000)) >> 8),
    b = ((color-(r*0x10000) - (g * 0x100)) )

){ return [r/255, g/255, b/255] }

function rgbaComponents( color,
    r = (color >> 24),
    g = ((color-(r*0x1000000)) >> 16),
    b = ((color-(r*0x1000000) - (g * 0x10000)) >> 8 ),
    a = ((color-(r*0x1000000) - (g * 0x10000)) - (b * 0x100) )

){ return [r/255, g/255, b/255, a/255] }
