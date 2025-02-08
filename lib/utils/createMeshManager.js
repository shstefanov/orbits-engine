import { useEffect, isValidElement } from "react";
import createTransitionManager from "./createTransitionManager.js";

const p = {}, v = () => {};

function uePlaceholder0(){ useEffect(v, []) }
function uePlaceholder1(){ useEffect(v, [p]) }
function uePlaceholder2(){ useEffect(v, [p,p]) }
function uePlaceholder3(){ useEffect(v, [p,p,p]) }
function uePlaceholder4(){ useEffect(v, [p,p,p,p]) }
function uePlaceholder6(){ useEffect(v, [p,p,p,p,p,p]) }

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


    // Handle 'interactive' attribute if present
    if(props.hasOwnProperty("interactive")){

        if(mesh) {
            mesh.setCursor = renderer.setCursor;
            if(props.hasOwnProperty("interactive")){
                if(isValidElement(props.hover)){
                    mesh.hoverIn  = handleHoverInElement;
                    mesh.hoverOut = handleHoverOutElement;
                }
                else {
                    mesh.hoverIn  = handleApplyMaterialAttributes;
                    mesh.hoverOut = handleUnapplyMaterialAttributes;
                }
            }
        }

        effects.push(
            !mesh ? uePlaceholder1 : (({ interactive, hitbox, name }, apply) => hitbox 
                ? apply( () => {  // With hitbox
                    if(interactive) {
                        mesh.hitbox = createHitbox(hitbox);
                        mesh.add(mesh.hitbox);
                        renderer.addMouseInteractiveObject(mesh.hitbox);
                    }
                    else            {
                        renderer.removeMouseInteractiveObject(mesh.hitbox);
                        mesh.remove(mesh.hitbox);
                    }
                    renderer.render();
                }, [!!interactive])
                : apply( () => { // Without hitbox
                    if(interactive) renderer.addMouseInteractiveObject(mesh);
                    else            renderer.removeMouseInteractiveObject(mesh);
                    renderer.render();
                }, [!!interactive])
            )
        );
    }
    


    // Handle 'renderOrder' attribute if present
    props.hasOwnProperty("renderOrder") && effects.push(
        !mesh ? uePlaceholder1 : (({ renderOrder, overlay }, apply) => apply( () => {
            if(overlay) return;
            mesh.renderOrder = renderOrder;
            renderer.render();
        }, [renderOrder]))
    );

    // Handle 'overlay' attribute if present
    props.hasOwnProperty("overlay") && effects.push(
        !mesh ? uePlaceholder1 : (({ overlay, renderOrder = 0 }, apply) => apply( () => {
            let render = false;
            if(overlay){
                render = true;
                mesh.noOverlayProps = {};
                mesh.renderOrder = Infinity;
                mesh.noOverlayProps.depthFunc = mesh.material.depthFunc;
                mesh.material.depthFunc = THREE.AlwaysDepth;
                mesh.material.needsUpdate = true;
            }
            else if(mesh.noOverlayProps) {
                render = true;
                mesh.renderOrder = renderOrder;
                mesh.material.depthFunc = mesh.noOverlayProps.depthFunc;
                delete mesh.noOverlayProps.depthFunc;
            }
            if(render){
                mesh.material.needsUpdate = true;
                renderer.render();
            }

        }, [overlay]))
    );

    // Handle 'visible' attribute if present
    props.hasOwnProperty("visible") && effects.push(
        !mesh ? uePlaceholder1 : (({ visible }, apply) => apply( () => {
            mesh.visible = visible;
            renderer.render();
        }, [visible]))
    );

    // If we have lookAt, we should ignore rotation
    // position and lookAt together should have own behavior
    position && props.hasOwnProperty("lookAt") && effects.push(
        !mesh ? uePlaceholder6 : (({ lookAt, position: { x, y, z }}, apply) => apply( () => {
            mesh.position.set(x, y, z);
            mesh.lookAt(lookAt.x, lookAt.y, lookAt.z);
            renderer.render();
        }, [x, y, z, lookAt.x, lookAt.y, lookAt.z]))
    );

    // Position without lookAt
    position && !props.hasOwnProperty("lookAt") && effects.push(
        !mesh ? uePlaceholder3 : (({ position: { x, y, z }}, apply) => apply( () => {
            mesh.position.set(x, y, z);
            renderer.render();
        }, [x, y, z]))
    );

    // If we have lookAt, we should ignore rotation
    (rotation && !props.hasOwnProperty("lookAt")) && effects.push(
        !mesh ? uePlaceholder4 : (({ rotation: { x, y, z, order = mesh.rotation.order }}, apply) => apply( () => {
            mesh.rotation.set(x, y, z, order);
            renderer.render();
        }, [x, y, z, order]))
    );

    typeof scale === "number" && effects.push(
        !mesh ? uePlaceholder1: (({ scale }, apply) => apply( () => {
            mesh.scale.set(scale, scale, scale);
            renderer.render();
        }, [scale]))
    );

    typeof scale === "object" && effects.push(
        !mesh ? uePlaceholder3 : (({ scale: { x, y, z }}, apply) => apply( () => {
            mesh.scale.set(x, y, z);
            renderer.render();
        }, [x, y, z]))
    );

    typeof up === "object" && effects.push(
        !mesh ? uePlaceholder3 : (({ up: { x, y, z }}, apply) => apply( () => {
            mesh.up.set(x, y, z);
            renderer.render();
        }, [x, y, z]))
    );

    // Only lookAt, without position
    props.hasOwnProperty("lookAt") && !position && effects.push(
        !mesh ? uePlaceholder3 : (({ lookAt }, apply) => apply( () => {
            if(!lookAt) return;
            mesh.lookAt(lookAt.x, lookAt.y, lookAt.z);
            renderer.render();
        }, [lookAt?.x, lookAt?.y, lookAt?.z]))
    );


    if(props.hasOwnProperty("transition"))         createTransitionManager(mesh, props, renderer, props.transition,    "transition"    );
    else if(props.hasOwnProperty("period"))        createTransitionManager(mesh, props, renderer, props.period,        "period"        );
    else if(props.hasOwnProperty("relTransition")) createTransitionManager(mesh, props, renderer, props.relTransition, "relTransition" );
    else if(props.hasOwnProperty("relPeriod"))     createTransitionManager(mesh, props, renderer, props.relPeriod,     "relPeriod"     );


    props.hasOwnProperty("transition") && createTransitionManager(mesh, props, renderer, props.transition, "transition" );
    props.hasOwnProperty("period")     && createTransitionManager(mesh, props, renderer, props.period,     "period"     );

    props.hasOwnProperty("animation") && effects.push(
        !mesh ? uePlaceholder1 : (({ animation, animationFade = 0 }, apply) => apply( () => {
            mesh.currentClip && (animationFade ? mesh.currentClip.fadeOut(animationFade) : mesh.currentClip.stop());
            mesh.currentClip = mesh.animClips[animation] || null;
            mesh.currentClip && mesh.currentClip.reset();
            mesh.currentClip && (animationFade ? mesh.currentClip.fadeIn(animationFade) : mesh.currentClip.play());
        }, [animation]))
    );

    // That is when geometry is BufferGeometry
    props.hasOwnProperty("points") && effects.push(
        !mesh ? uePlaceholder1 : (({ points, interactive }, apply) => apply( () => {
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
            geometry.computeBoundingSphere();
            if(interactive) geometry.computeBoundingBox();
            renderer.render();
        }, [points]))
    );

    props.hasOwnProperty("rgbColors") && effects.push(
        !mesh ? uePlaceholder1 : (({ points }, apply) => apply( () => {
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
        !mesh ? uePlaceholder1 : (({ points }, apply) => apply( () => {
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

const hitboxMaterial = new THREE.MeshBasicMaterial({visible: false});
function createHitbox(geometry){
    return new THREE.Mesh(geometry, hitboxMaterial);
}

function handleHoverInElement(){
    this.setShowHoverElement(true);
    this.userData.hasOwnProperty("cursor") && this.setCursor(this.userData.cursor);
}
function handleHoverOutElement(){
    this.setShowHoverElement(false);
    this.userData.hasOwnProperty("cursor") && this.setCursor(null);
}


function handleApplyMaterialAttributes(){
    this.hoverOutAttributes = {};
    if(this.userData.hover) for(let key of this.userData.hover){
        const value = this.userData.hover[key];
        this.hoverOutAttributes[key] = this.material[key];
        this.material[key] = value;
    }
    this.userData.hasOwnProperty("cursor") && this.setCursor(this.userData.cursor);

}
function handleUnapplyMaterialAttributes(){
    // Reapply this.howerOutAttributes to the material
    this.hoverOutAttributes = null;
    this.userData.hasOwnProperty("cursor") && this.setCursor(null);
}
