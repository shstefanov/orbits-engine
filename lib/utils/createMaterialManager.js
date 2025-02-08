import { useEffect } from "react";
import * as THREE from "three";

const skip = { set: () =>{} };

export default function createMaterialManager(material, props, renderer, initialized){

    if(initialized) return;

    const effects = [];

    for(let propName in props) {
        if(propName in nonManagedProps         ) continue;
        else if(propName in colorAttributes    ) effects.push( createColorManager            ( material, propName, renderer ) );
        else if(propName in constantAttributes ) effects.push( createConstantManager         ( material, propName, renderer ) );
        else if(propName in eulerAttributes    ) effects.push( createEulerManager            ( material, propName, renderer ) );
        else if(propName in vector2Attributes  ) effects.push( createVector2Manager          ( material, propName, renderer ) );
        else if(propName in textureAttributes  ) effects.push( createTextureManager          ( material, propName, renderer ) );
        else                                     effects.push( createRegularAttributeManager ( material, propName, renderer ) );
    }

    return !effects.length ? skip : {
        set: function({children, ...props}){
            if(material) material.userData = props;
            for(let effect of effects) effect(props);
        }
    }
}

const p = {}, v = () => {};
function uePlaceholder1(){ useEffect(v, [p]) }
function uePlaceholder2(){ useEffect(v, [p,p]) }
function uePlaceholder4(){ useEffect(v, [p,p,p,p]) }

function createColorManager(material, propName, renderer){
    return !material ? uePlaceholder1 : (props, apply) => useEffect( () => {
       material[propName].setHex( props[propName] );
       material.needsUpdate = true;
       renderer.render();
    }, [props[propName]]);
}

function createEulerManager(material, propName, renderer){
    return !material ? uePlaceholder4 : (props) => useEffect( () => {
       const euler = props[propName];
       material[propName].set( euler.x, euler.y, euler.z, euler.order || "XYZ" );
       material.needsUpdate = true;
       renderer.render();
    }, [props[propName].x, props[propName].y, props[propName].z, props[propName].order]);
}

function createVector2Manager(material, propName, renderer){
    return !material ? uePlaceholder2 : (props) => useEffect( () => {
        const vector = props[propName];
        material[propName].set( euler.x, euler.y);
        material.needsUpdate = true;
        renderer.render();
     }, [ props[propName].x, props[propName].y ]);
}

function createConstantManager(material, propName, renderer){
    return !material ? uePlaceholder1 : (props) => useEffect( () => {
        material[propName] = THREE[props[propName]];
        material.needsUpdate = true;
        renderer.render();
     }, [ props[propName]]);
}

function createTextureManager(material, propName, renderer){
    throw new Error("TODO: Implement texture manager");
}

function createRegularAttributeManager(material, propName, renderer){
    return !material ? uePlaceholder1 : (props) => useEffect( () => {
        material[propName] = props[propName];
        material.needsUpdate = true;
        renderer.render();
    }, [ props[propName]]);
}




const nonManagedProps = { type: true };

const textureAttributes = {
    alphaMap: true,
    aoMap: true,
    envMap: true,
    lightMap: true,
    map: true,
    specularMap: true,
    displacementMap: true,
    bumpMap: true,
    emissiveMap: true,
    lightMap: true,
    normalMap: true,
    matcap: true,
    anisotropyMap: true,
    clearcoatMap: true,
    clearcoatNormalMap: true,
    clearcoatRoughnessMap: true,
    iridescenceMap: true,
    iridescenceThicknessMap: true,
    sheenRoughnessMap: true,
    sheenColorMap: true,
    specularIntensityMap: true,
    specularColorMap: true,
    thicknessMap: true,
    transmissionMap: true,
    metalnessMap: true,
    roughnessMap: true,
    gradientMap: true,
};

const constantAttributes = {
    combine: true,
    depthFunc: true,
    stencilFunc: true,
    stencilFail : true,
    stencilZFail: true,
    stencilZPass: true,
    blendDst: true,
    blendEquation: true,
    side: true,
};

export const colorAttributes = {
    color: true,
    blendColor: true,
    emissive: true,
    specular: true,
    attenuationColor: true,
    sheenColor: true,
    specularColor: true,
};

const eulerAttributes = {
    envMapRotation: true,
};

const vector2Attributes = {
    clearcoatNormalScale: true,
};
