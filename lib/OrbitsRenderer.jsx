import React, { useState, useEffect, createContext, useContext } from "react";

import * as THREE from 'three';

const rendererContext = createContext();
export const useRenderer = () => useContext(rendererContext);

const RendererProvider = rendererContext.Provider;

function getSize(canvas){
    let { width, height } = getComputedStyle(canvas);
    width  = parseInt(width  .replace("px", ""));
    height = parseInt(height .replace("px", ""));
    return { width, height };
}

export default function OrbitsRenderer({

    children,

    style={},
    className="",
    
    autoresize=false,
    size=null,

    canvas,
    config = {},

    ...options


}){

    const [ renderer,   setRenderer   ] = useState(null);
    const [ domElement, setDomElement ] = useState(null);

    // In case canvas is externally created and managed
    config.canvas && useEffect( () => {
        const renderer = new THREE.WebGLRenderer(config);
        renderer.actualSize = getSize(canvas);
        Object.assign(renderer, renererAdditionalFunctions);
        renderer.initRenderer();
        setRenderer(renderer);
        return () => {
            renderer.dispose();
            delete renderer.renderScenes;
        };
    }, []);

    // In case we need to create and mount canvas domElement
    !config.canvas && useEffect( () => {
        if(!domElement) return;
        const renderer = new THREE.WebGLRenderer({...config, canvas: domElement});
        renderer.actualSize = getSize(domElement);
        Object.assign(renderer, renererAdditionalFunctions);
        renderer.initRenderer();
        setRenderer(renderer);

        return () => {
            renderer.dispose();
            delete renderer.renderScenes;
        };
    }, [domElement]);


    !autoresize && useEffect(() => {
        if(renderer && size && (domElement||canvas)) {
            (domElement||canvas).width  = size.width;
            (domElement||canvas).height = size.height;
            renderer.setSize( size.width, size.height );
        }
    }, [renderer, size]);

    // Getting size from css style and update
    // Subscribe to windor resize event and apply
    autoresize && useEffect(() => {
        if(renderer && (domElement||canvas)){
            let t;
            renderer.actualSize = getSize(domElement||canvas);
            function setSize(){

                if(t) clearTimeout(t);

                t = setTimeout(() => {
                    const { width, height } = getSize((domElement||canvas));
                    renderer.setSize( width, height, false );
                    renderer.actualSize = { width, height };
                    renderer.updateResizeListeners(width, height);
                    renderer.doRender = true;
                    t = null;
                }, 100);
            }
            setSize();
            window.addEventListener("resize", setSize);
            return () => {
                window.removeEventListener("resize", setSize);
            }
            
        }
    }, [ renderer ]);

    // Handle the rest of the options
    const options_arr = [renderer, ...Object.values(options)];
    options_arr.length > 1 && useEffect(() => {
        if(!renderer) return;
        Object.assign(renderer, options);
        renderer.doRender = true;
    }, options_arr );
    
    // renderer && children means children are allowed to render after renderer is initiated
    if(canvas) return renderer && <RendererProvider value={renderer}> { children } </RendererProvider>;
    else return <>
        <canvas ref={setDomElement} style={style} className={className}></canvas>
        { renderer && <RendererProvider value={renderer}> { children } </RendererProvider> }
    </>;

}


const renererAdditionalFunctions = {

    initRenderer: function initRenderer(){
        this.scenes = [];
        this.resizeListeners = [];
        this.waitForQueue = [];
        const render = () => {
            if(!this.renderScenes) return;
            if(!this.doRender) return requestAnimationFrame(render);
            this.doRender = false;
            this.processWaitFor();
            this.renderScenes();
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    },
    
    addScene: function addScene(scene){
        this.scenes.push(scene);
        this.scenes.sort( (a, b) => a.renderOrder - b.renderOrder() );
        this.doRender = true;
    },
    
    removeScene: function removeScene(scene){
        this.scenes.splice(this.scenes.indexOf(scene));
        this.scenes.sort( (a, b) => a.renderOrder - b.renderOrder );
        this.doRender = true;
    },
    
    updateScene: function updateScene(scene){
        this.scenes.sort( (a, b) => a.renderOrder - b.renderOrder() );
        this.doRender = true;
    },
    
    renderScenes: function renderScenes(){
        for(let scene of this.scenes){
            const camera = scene.camera || this.camera;
            if(!camera) continue;
            scene.clearDepth && this.clearDepth();
            this.render( scene, camera );
        }
    },


    addResizeListener: function(fn){
       this.resizeListeners.push(fn); 
    },

    removeResizeListener: function(fn){
        const index = this.resizeListeners.indexOf(fn);
        index > -1 && this.resizeListeners.splice(index, 1);
    },

    updateResizeListeners: function(width, height){
        for(let rl of this.resizeListeners) rl(width, height);
    },

    waitFor: function(fn){
        this.waitForQueue.push(fn);
    },

    processWaitFor: function(){
        for(let wf of this.waitForQueue){
            if(wf()) wf.done = true;
        }
        this.waitForQueue = this.waitForQueue.filter(wf => !wf.done);
    }


};







function drawScenes(){
    this.render = true;
}