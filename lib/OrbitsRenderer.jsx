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

    pixelRatio = window.devicePixelRatio,

    ...options


}){

    const [ renderManager, setRenderManager ] = useState(null);
    const [ domElement,    setDomElement    ] = useState(config.canvas);
    // const [ eventLayer,    setEventLayer    ] = useState(config.eventLayer);

    useEffect( () => {
        if(!domElement) return; // Nothing to do without canvas or eventLayer
        const renderer = new THREE.WebGLRenderer({...config, canvas: domElement});
        renderer.setPixelRatio(pixelRatio);

        const renderManager = new RenderManager(renderer, /*eventLayer*/);
        setRenderManager(renderManager);
        return () => { renderManager.dispose(); };
    }, [ domElement ]);


    // In case size is externally managed
    !autoresize && size && useEffect( () => {
        if(renderManager && domElement) {
            domElement.width  = size.width;
            domElement.height = size.height;
            renderManager.setResizeInitialized( true );
            renderManager.setSize( size );
        }
    }, [ renderManager, domElement, size ]);

    // Getting size from css style and update
    // Subscribe to windor resize event and apply
    autoresize && useEffect(() => {
        if(!renderManager || !domElement ) return; // Nothing to do
        
        let t;
        function handleSize(e, timeout = 100){
            if(t) clearTimeout(t);
            t = setTimeout(() => {
                renderManager.setResizeInitialized( true );
                renderManager.setSize( getSize(domElement) );
                t = null;
            }, timeout);
        }

        handleSize(null, 0);
        
        window.addEventListener("resize", handleSize);
        return () => window.removeEventListener("resize", handleSize);

    }, [ renderManager, domElement ]);

    // Handle the rest of the options
    const options_arr = [renderManager, ...Object.values(options)];
    options_arr.length > 1 && useEffect(() => {
        if(!renderManager) return;
        renderManager.setRendererOptions(options);
    }, options_arr );

    // renderer && children means children are allowed to render after renderer is initiated
    if(canvas) return renderManager && <RendererProvider value={renderManager}> { children } </RendererProvider>;
    else return <>
        <canvas ref={setDomElement} style={style} className={className}></canvas>
        {/* <div draggable ref={setEventLayer} style={{width: "100%", height: "100%" }} /> */}
        { renderManager && <RendererProvider value={renderManager}> { children } </RendererProvider> }
    </>;

}

class RenderManager {
    
    #renderer        = null;
    #canvas          = null;
    #scenes          = [];
    #raycaster       = new THREE.Raycaster();

    
    
    
    
    constructor(renderer){
        this.#renderer   = renderer;
        this.#canvas     = renderer.domElement;
        this.#actualSize = getSize(this.#canvas);

        this.initRendererLoop();
        this.initMouseEvents();
    }

    dispose(){
        this.#renderer.dispose();
        this.stopLoop();

        const canvas = this.#canvas

        for(let ev in this.#bh) canvas.removeEventListener(ev, this.#bh[ev]);
        for(let ev in this.#dh) canvas.removeEventListener(ev, this.#dh[ev]);

        // this.#raycaster = null;
        // this.#scenes    = null;
        // this.#renderer  = null;
        // this.#canvas    = null;
    }

    setRendererOptions(options){
        Object.assign(this.#renderer, options);
        this.render();
    }

    getCanvas(){ return this.#canvas; }

    initRendererLoop(){

        let delta_anchor = Date.now();
        let render = () => {
            
            const now = Date.now();
            const delta = now - delta_anchor;
            delta_anchor = now;

            this.processWaitFor();

            if(this.#scenes.length) {
                if(this.#animatedObjects.size) this.renderWithAnimations(delta, now);
                else                           this.renderWithoutAnimations(delta, now);     
            }
            
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        this.stopLoop = () => { render = () => {}; };


    }

    addScene(scene){
        this.#scenes.push(scene);
        scene.renderer = this;
        this.updateScenes();
    }

    removeScene(scene){
        this.#scenes.splice(this.#scenes.indexOf(scene));
        delete scene.renderer;
        this.updateScenes();
    }

    updateScenes(){
        this.#scenes.sort( (a, b) => a.renderOrder - b.renderOrder );
        this.render();
    }

    renderScenes(){
        
        const renderer = this.#renderer;
        window.renderer = this;

        for(let scene of this.#scenes){
            const camera = scene.camera;
            if(!camera) continue;
            scene.clearDepth && renderer.clearDepth();
            renderer.render( scene, camera );
        }
    }

    renderWithAnimations(delta, now){
        this.processAnimations(this.#animatedObjects.entries(), delta, now);
        this.renderScenes();
    }

    renderWithoutAnimations(){
        if(this.doRender) {
            this.doRender = false;
            this.renderScenes();
        }
    }


    /*
        Animations
    */
    #animatedObjects = new Set();
    addAnimatedObject    (mesh){ this.#animatedObjects.add(mesh); }
    removeAnimatedObject (mesh){ this.#animatedObjects.delete(mesh); }
    processAnimations    (entries, delta, now){
        const delta_seconds = delta / 1000;
        for(let [ mesh ] of entries) mesh.animMixer.update(delta_seconds, now);
    }

    /*
        Size and Resize
    */
    #resizeListeners   = new Set();
    #resizeInitialized = false;
    #actualSize        = { width: 0, height: 0 };
    setSize(size){
        this.#actualSize = Object.freeze(size);
        this.#canvas.width  = size.width;
        this.#canvas.height = size.height;
        this.#renderer.setSize(size.width, size.height, false);
        for(let [fn] of this.#resizeListeners.entries()) fn(size);
        this.render();
    }
    getSize(){ return this.#actualSize; }
    setResizeInitialized(initialized){ this.#resizeInitialized = initialized; }
    addResizeListener(fn){
        this.#resizeListeners.add(fn);
        if(this.#resizeInitialized) fn(this.#actualSize);
    }
    removeResizeListener(fn){ this.#resizeListeners.delete(fn); }



    #waitForQueue = [];
    waitFor(fn){ this.#waitForQueue.push(fn); }
    processWaitFor(){
        for(let wf of this.#waitForQueue) wf.done = wf();
        this.#waitForQueue = this.#waitForQueue.filter(wf => !wf.done);
    }


    /*
        Events
    */

    #dh = {}; // Drag  Event handlers for later unbinding
    #bh = {}; // Basic Event handlers for later unbinding
    #mouseInteractiveObjects = [];

    initMouseEvents(){
        const el   = this.#canvas;
        const objs = this.#mouseInteractiveObjects;

        // TODO: Reuse resolved targets

        let reuse            = {};
        let button_down      = null;
        let target_object    = null;
        
        let target_event     = null; let target_event_props     = {}
        let mousedown_event  = null; let mousedown_event_props  = {};
        let drag_start_event = null; let drag_start_event_props = {};
        let drag_over_event  = null; let drag_over_event_props  = {};

        // Basic event handlers
        el.addEventListener("click", this.#bh.click = e => {
            if(target_event){
                this.reuseEvent (e, target_event, "onClick");
            }
            
        });
        
        el.addEventListener("mouseup", this.#bh.mouseup = event => {
            
            if(target_event){
                this.reuseEvent (event, target_event, "onMouseUp");
            }
            
            if(drag_start_event){
                
                this.reuseEvent (event, {
                    ...drag_start_event,
                    dropTarget: drag_over_event_props ? {...drag_over_event_props} : null,
                }, "onDragStop");
                
                if(drag_over_event){
                    this.reuseEvent(event, {
                        ...drag_over_event_props,
                        dragTarget: drag_start_event_props,
                    }, "onDrop" );
                    drag_over_event       = null;
                    drag_over_event_props = {};
                }
                
                drag_start_event       = null;
                drag_start_event_props = {};
            }
            if(mousedown_event){
                mousedown_event  = null; mousedown_event_props  = {};
                drag_start_event = null; drag_start_event_props = {};
            }
        });
        
        el.addEventListener("mousedown", this.#bh.mousedown = event => {

            if(target_event) {
                this.reuseEvent (event, target_event, "onMouseDown");
                button_down           = event.button;
                mousedown_event       = event;
                mousedown_event_props = target_event_props;
                if(event.button === 0){
                    this.reuseEvent (event, mousedown_event_props, "onDragStart");
                    // Only allow drag if event is preventdefaulted
                    if(event.defaultPrevented){
                        event.stopImmediatePropagation();
                        drag_start_event       = mousedown_event;
                        drag_start_event_props = mousedown_event_props;
                    }
                }

            }
        });
        
        el.addEventListener("contextmenu", this.#bh.contextmenu = e => {
            if(target_event) {
                this.reuseEvent (e, target_event_props, "onContextMenu");
            }
        });



        
        el.addEventListener("mousemove", this.#bh.mousemove = event => {

            const current_event       = this.resolveEventMatch(event, objs );

            if(!current_event) return;

            const ray                 = current_event.ray;
            const current_event_props = { ...current_event };
            
            const object = current_event_props?.intersection?.object || null;

            if(object !== target_object){
                if(target_object){
                    this.reuseEvent (event, target_event_props, "onMouseOut");
                    this.reuseEvent (event, target_event_props, "onMouseLeave");
                }
                if(object){
                    this.reuseEvent (event, current_event_props, "onMouseOver");
                    this.reuseEvent (event, current_event_props, "onMouseEnter");
                }
            }

            object && this.reuseEvent (event, current_event_props, "onMouseMove");

            if(drag_start_event){
                // First emit onDrag
                this.reuseEvent(event, {
                    ...current_event_props,
                    dragSource: drag_start_event_props,
                }, "onDrag", drag_start_event_props.intersection.object);

                // Then search for other object
                if(object){
                    if(object !== drag_start_event_props.intersection.object){
                        drag_over_event       = current_event;
                        drag_over_event_props = current_event_props;
                        this.reuseEvent(event, {
                            ...current_event_props,
                            dragSource: drag_start_event_props,
                        }, "onDragOver" );
                    }
                }
                else {
                    drag_over_event       = null;
                    drag_over_event_props = null;
                }

            }

            if(object){
                target_event       = current_event;
                target_event_props = current_event_props;
                target_object      = object;
            }
            else {
                target_event       = null;
                target_event_props = {};
                target_object      = null;
            }


        });

    }

    dispatchEvent( event, listenerName, target_object = event.intersection?.object ){
        let node = { parent: target_object };
        while(node = node.parent){
            (node.userData[listenerName])?.call(node, event);
            if(event.cancelBubble) break;
        }
    }

    reuseEvent(event, { intersection = null, intersections = null, ray = null, dratTarget, dropTarget }, listenerName, target_object){
        event.intersection  = intersection;
        event.intersections = intersections;
        event.ray           = ray;
        if(dratTarget) event.dratTarget = dratTarget;
        if(dropTarget) event.dropTarget = dropTarget;
        this.dispatchEvent(event, listenerName, target_object);
    }

    resolveEventMatch(event, objects){
        const raycaster = this.#raycaster;
        for(let { camera } of this.#scenes){
            if(!camera) return;
            this.updateRayCaster(event, camera);
            const intersections = raycaster.intersectObjects( objects );
            const intersection  = intersections[0];
            if(!intersection) return { ray: raycaster.ray.clone(), intersections: [] };
            event.intersection  = intersection;
            event.intersections = intersections;
            event.ray = raycaster.ray.clone();
            return event;
        }
    }

    addMouseInteractiveObject(mesh){
        this.#mouseInteractiveObjects.push(mesh);

    }
    removeMouseInteractiveObject(mesh){
        const objects = this.#mouseInteractiveObjects;
        objects.splice(objects.indexOf(mesh), 1);
    }

    updateRayCaster({ offsetX, offsetY }, camera){
        const size = this.getSize();
        const vec2 = new THREE.Vector2(
            ( (offsetX * 2) / size.width ) - 1,
            1 - (( offsetY * 2) / size.height)
        );
        this.#raycaster.setFromCamera( vec2, camera );
    }


    render(){
        this.doRender = true;
        return this;
    }
}
