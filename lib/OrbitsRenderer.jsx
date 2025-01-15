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
            
            function setSize(e, timeout = 100){

                if(t) clearTimeout(t);

                t = setTimeout(() => {
                    
                    const { width, height } = getSize((domElement||canvas));
                    renderer.setSize( width, height, false );
                    renderer.actualSize = { width, height };
                    renderer.resizeInitialized = true;
                    renderer.updateResizeListeners(width, height);
                    renderer.doRender = true;
                    t = null;
                }, timeout);
            }
            setSize(null, 0);
            window.addEventListener("resize", setSize);
            return () => {
                window.removeEventListener("resize", setSize);
            }
            
        }
    }, [ renderer, domElement || canvas ]);

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
        let delta_anchor = Date.now();
        
        const renderWithAnimations = (delta, now) => {
            this.processAnimations(animatedMeshes.entries(), delta, now);
            this.renderScenes();
        };

        const renderWithoutAnimations = (delta, now) => {
            if(this.doRender) {
                this.doRender = false;
                this.renderScenes();
            }
        };
        
        
        
        let render = () => {

            const now = Date.now();
            const delta = now - delta_anchor;
            delta_anchor = now;

            this.processWaitFor(); // always run

            if(!this.renderScenes) return;

            if(animatedMeshes.size) renderWithAnimations(delta, now);
            else                    renderWithoutAnimations(delta, now);

            requestAnimationFrame(render);

        }
        requestAnimationFrame(render);

        let animatedMeshes = new Set();

        this.addAnimatedMesh = mesh => {
            animatedMeshes.add(mesh);
        }

        this.removeAnimatedMesh = mesh => {

        }



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

    processAnimations: function(entries, delta, now){
        const delta_seconds = delta / 1000;
        for(let [ mesh ] of entries) mesh.updateAnimation(delta_seconds, now);
    },


    addResizeListener: function(fn){
       this.resizeListeners.push(fn);
       if(this.resizeInitialized) fn(this.actualSize.width, this.actualSize.height);
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
    },


    addAnimatedMesh: function(mesh){

    },

    removeAnimatedMesh: function(mesh){

    },



};







function drawScenes(){
    this.render = true;
}