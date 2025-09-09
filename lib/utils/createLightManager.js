import { useEffect } from "react";
import * as THREE    from "three";

const p = {}, v = () => {};

function uePlaceholder0(){ useEffect(v, []) }
function uePlaceholder1(){ useEffect(v, [p]) }
function uePlaceholder2(){ useEffect(v, [p,p]) }
function uePlaceholder3(){ useEffect(v, [p,p,p]) }
function uePlaceholder4(){ useEffect(v, [p,p,p,p]) }
function uePlaceholder6(){ useEffect(v, [p,p,p,p,p,p]) }

function applyNow(fn){ fn() }
const skip = { set: () =>{} };

export default function createLightManager(light, props, renderer, initialized, effects = []){

    if(initialized) return;

    bindColorValue     ( "color",       light, props, renderer, effects );
    bindColorValue     ( "groundColor", light, props, renderer, effects );
    bindPrimitiveValue ( "intensity",   light, props, renderer, effects );
    bindPrimitiveValue ( "castShadow",  light, props, renderer, effects );
    bindPrimitiveValue ( "decay",       light, props, renderer, effects );
    bindPrimitiveValue ( "distance",    light, props, renderer, effects );
    bindPrimitiveValue ( "power",       light, props, renderer, effects );
    bindPrimitiveValue ( "shadow",      light, props, renderer, effects );
    bindPrimitiveValue ( "angle",       light, props, renderer, effects );
    bindPrimitiveValue ( "width",       light, props, renderer, effects );
    bindPrimitiveValue ( "height",      light, props, renderer, effects );
    bindPrimitiveValue ( "penumbra",    light, props, renderer, effects );
    bindVector3Value   ( "position",    light, props, renderer, effects );
    bindTargetPosition ( "target",      light, props, renderer, effects );
    bindLookAt( light, props, renderer, effects );
    

    return !effects.length ? skip : {
        set: function(props, apply = applyNow){
            if(light) light.userData = props;
            for(let effect of effects) effect(props, apply);
        }
    }
}


function bindColorValue(propName, light, props, renderer, effects){
    const targetColor = light && light[propName];
    props.hasOwnProperty(propName) && effects.push(
        !light ? uePlaceholder1 : ((props, apply) => apply( () => {
            targetColor.setHex(props[propName]);
            renderer.render();
        }, [props[propName]]))
    );
}

function bindPrimitiveValue(propName, light, props, renderer, effects){
    props.hasOwnProperty(propName) && effects.push(
        !light ? uePlaceholder1 : ((props, apply) => apply( () => {
            light[propName] = props[propName];
            renderer.render();
        }, [props[propName]]))
    );
}

function bindVector3Value(propName, light, props, renderer, effects, targetVector = light && light[propName]){
    props.hasOwnProperty(propName) && effects.push(
        !light ? uePlaceholder3 : ((props, apply) => apply( () => {
            targetVector.set(props[propName].x, props[propName].y, props[propName].z);
            renderer.render();
        }, [props[propName].x, props[propName].y, props[propName].z]))
    );
}

function bindTargetPosition(propName, light, props, renderer, effects){
    props.hasOwnProperty(propName) && effects.push(
        !light ? uePlaceholder3 : ((props, apply, { x, y, z } = props[propName]) => apply( () => {
            light.target.position.set(x, y, z);
            renderer.render();
        }, [x, y, z]))
    );
}

function bindLookAt( light, props, renderer, effects ){
    props.hasOwnProperty("lookAt") && effects.push(
        !light ? uePlaceholder3 : (({lookAt: {x, y, z}}, apply) => apply( () => {
            light.lookAt(x, y, z);
            renderer.render();
        }, [x, y, z]))
    );
}