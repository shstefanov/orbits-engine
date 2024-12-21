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

    ...options


}){

    const [ renderer, setRenderer ] = useState(null);
    const [ canvas,   setCanvas   ] = useState(null);



    // In case canvas is externally created and managed
    options.canvas && useEffect( () => {
        const renderer = new THREE.WebGLRenderer(options);
        renderer.actualSize = getSize(options.canvas);
        Object.assign(renderer, renererAdditionalFunctions);
        renderer.initRenderer();
        setRenderer(renderer);
        return () => {
            renderer.dispose();
            delete renderer.renderScenes;
        };
    }, []);

    // In case we need to create and mount canvas domElement
    !options.canvas && useEffect( () => {
        if(!canvas) return;
        const renderer = new THREE.WebGLRenderer({...options, canvas});
        renderer.actualSize = getSize(canvas);
        Object.assign(renderer, renererAdditionalFunctions);
        renderer.initRenderer();
        setRenderer(renderer);

        return () => {
            renderer.dispose();
            delete renderer.renderScenes;
        };
    }, [canvas]);


    !autoresize && useEffect(() => {
        if(renderer && size && (canvas||options.canvas)) {
            (canvas||options.canvas).width  = size.width;
            (canvas||options.canvas).height = size.height;
            renderer.setSize( size.width, size.height );
        }
    }, [renderer, size]);

    // Getting size from css style and update
    // Subscribe to windor resize event and apply
    autoresize && useEffect(() => {
        if(renderer && (canvas||options.canvas)){
            let t;
            renderer.actualSize = getSize(canvas||options.canvas);
            function setSize(){

                if(t) clearTimeout(t);

                t = setTimeout(() => {
                    const { width, height } = getSize((canvas||options.canvas));
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


    
    // renderer && children means children are allowed to render after renderer is initiated

    if(options.canvas) return renderer && <RendererProvider value={renderer}> { children } </RendererProvider>;
    else return <>
        <canvas ref={setCanvas} style={style} className={className}></canvas>
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