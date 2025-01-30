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
    #defaultCursor   = "";

    
    
    
    
    constructor(renderer){
        this.#renderer   = renderer;
        this.#canvas     = renderer.domElement;
        this.#actualSize = getSize(this.#canvas);
        this.#defaultCursor = this.#canvas.style.cursor || "default";

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

        for(let scene of this.#scenes){
            const camera = scene.camera;
            if(!camera) continue;
            scene.clearDepth && renderer.clearDepth();
            renderer.render( scene, camera );
        }
        if(this.#doRedispatchLastMouseEvent){
            this.repeatLastMouseMove();
        }
        this.#doRedispatchLastMouseEvent = true;
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

    #doRedispatchLastMouseEvent = true;
    #lastMouseMoveEvent = null;
    repeatLastMouseMove(){
        if(this.#lastMouseMoveEvent){
            const { 
                clientX, clientY, pageX, pageY, offsetX, offsetY,
                altKey, ctrlKey, shiftKey, metaKey, cancelBubble
            } = this.#lastMouseMoveEvent;

            const syntheticEvent = new MouseEvent('mousemove', {
                clientX, clientY, pageX, pageY, offsetX, offsetY,
                altKey, ctrlKey, shiftKey, metaKey,
                bubbles: !cancelBubble,
                cancelable: true,
            });

            syntheticEvent.isRedispatched = true;
    
            // Dispatch the event to the canvas
            this.#canvas.dispatchEvent(syntheticEvent);
        }
    }

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
        let click_event      = null; let click_event_props      = {};
        
        // Reset in on mouseup
        let drag_over_event  = null; let drag_over_event_props  = {};
        let drag_over_stack  = {
            drag_over_event: null, drag_over_event_props: {},
            drag_over_event: null,
            dragtrough_objects: [],
        };

        function isNested(obj1, obj2){
            return (!obj1?.parent || !obj2) ? false : (obj1.parent === obj2 || isNested(obj1.parent, obj2));
        }

        function searchUp(obj, fn, node = { parent: obj }){
            let result;
            while(node = node.parent) if((result = fn(node)) !== undefined) return result;
        }

        function findDropZone   ({ userData: { dropzone   }}) { return dropzone;   }
        function findDragTrough ({ userData: { dragtrough }}) { return dragtrough; }

        function resolveDragOverStack( current_event, current_event_props, prev_result ){
            
            const { intersections } = current_event_props; // ordered by distance from closest to fartest
            const dragged_object    = drag_start_event_props.intersection.object;
            const target_dropzone   = drag_start_event.intersection.object.userData.draggable;
            const intersecting_objects = intersections.map( ({object}) => object );

            const result = {
                drag_over_event: null, drag_over_event_props: {}, // This will be the final target
                dragtrough_objects: [],
                events: {
                    onDrag:            { event: current_event, event_props: [{ ...current_event_props, object: dragged_object }] },
                    onDragTroughStart: { event: current_event, event_props: [] },
                    onDragTroughEnd:   { event: current_event, event_props: [] },
                    onDragTrough:      { event: current_event, event_props: [] },
                    onDragOver:        { event: current_event, event_props: [] },
                    // onDrop:            { event: current_event, event_props: [] }, // ?? To be done in onmouseup !
                }
            };

            for(let intersection of intersections){

                const object = intersection.object;

                const object_event_props = {
                    intersection,
                    intersections,
                    dragTarget: drag_start_event_props
                };
                let object_dropzone   = searchUp( object, findDropZone   );
                let object_dragtrough = searchUp( object, findDragTrough );

                if(object_dropzone === target_dropzone){
                    result.events.onDragOver .event_props.push(object_event_props);
                    result.drag_over_event       = current_event;
                    result.drag_over_event_props = object_event_props;
                    break;
                }
                else if(object_dragtrough){
                    result.dragtrough_objects.push(object);
                    if(prev_result.dragtrough_objects.indexOf(object) === -1){
                        result.events.onDragTroughStart.event_props.push(object_event_props);
                    }
                    else {
                        result.events.onDragTrough.event_props.push(object_event_props);    
                    }
                }
                else break;
            }

            for(let object of prev_result.dragtrough_objects){
                if(result.dragtrough_objects.indexOf(object) === -1){
                    const object_event_props = { ...current_event_props, object: object, dragTarget: drag_start_event_props };
                    result.events.onDragTroughEnd.event_props.push(object_event_props);
                }
            }

            // Do checks here


            return result;
        }

        this.setCursor = cursor => el.style.cursor = cursor || this.#defaultCursor;

        // Basic event handlers
        el.addEventListener("click", this.#bh.click = event => {
            if(target_event && click_event && target_event_props.intersection.object === click_event_props.intersection.object){
                this.reuseEvent (event, target_event, "onClick");
            }
            click_event = null; click_event_props = {};

        });
        
        el.addEventListener("mouseup", this.#bh.mouseup = event => {
            
            if(target_event){
                this.reuseEvent (event, target_event_props, "onMouseUp");
            }
            
            if(drag_start_event){
                
                this.reuseEvent (event, { ...drag_start_event,
                    dropTarget: drag_over_event_props ? {...drag_over_event_props} : null,
                }, "onDragStop");
                

                for(let object of drag_over_stack.dragtrough_objects){
                    const object_event_props = { ...target_event_props, object: object, dragTarget: drag_start_event_props };
                    this.reuseEvent(event, { ...object_event_props, }, "onDragTroughEnd", object );
                }

                if(drag_over_stack.drag_over_event){
                    this.reuseEvent(event, {
                        ...drag_over_stack.drag_over_event_props,
                        dragTarget: drag_start_event_props,
                    }, "onDragOverEnd", drag_over_stack.drag_over_event_props.intersection.object );
                    this.reuseEvent(event, {
                        ...drag_over_stack.drag_over_event_props,
                        dragTarget: drag_start_event_props,
                    }, "onDrop", drag_over_stack.drag_over_event_props.intersection.object );
                }

                // Reset drag target
                drag_start_event       = null;
                drag_start_event_props = {};
                
                // And reset dragover stack
                drag_over_event  = null; drag_over_event_props = {};
                drag_over_stack  = {
                    drag_over_event: null, drag_over_event_props: {},
                    dragtrough_objects: [],
                };
            }

            if(mousedown_event){
                mousedown_event  = null; mousedown_event_props  = {};
                drag_start_event = null; drag_start_event_props = {};
            }

        });
        
        el.addEventListener("mousedown", this.#bh.mousedown = event => {
            if(target_event) {
                this.reuseEvent (event, target_event_props, "onMouseDown");
                button_down           = event.button;
                mousedown_event       = event;
                mousedown_event_props = target_event_props;
                click_event           = event;
                click_event_props     = target_event_props;
                if(event.button === 0 && target_object.userData.draggable){
                    this.reuseEvent (event, mousedown_event_props, "onDragStart");
                    drag_start_event       = mousedown_event;
                    drag_start_event_props = mousedown_event_props;
                }
            }
        });
        
        el.addEventListener("contextmenu", this.#bh.contextmenu = event => {
            if(target_event) {
                this.reuseEvent (event, target_event_props, "onContextMenu");
            }
        });
        
        el.addEventListener("mousemove", this.#bh.mousemove = event => {

            if(!event.isRedispatched){
                this.#lastMouseMoveEvent = event;
            }
            
            if(!event.isRedispatched) this.#doRedispatchLastMouseEvent = false;

            const current_event = this.resolveEventMatch(event, objs);

            const ray                 = current_event.ray;
            const current_event_props = { ...current_event };
            
            const object      = current_event_props?.intersection?.object || null;
            const prev_object = target_event_props?.intersection?.object  || null;

            const is_same = object === prev_object;

            // if( event.isRedispatched
            //     && object 
            //     && is_same
            //     // && target_event
            //     && target_event_props.intersection.point.equals(target_event_props.intersection.point)
            // ) return; // Do not redispatch if hitpoint and object are same, prevents some infinite render loops



            // Mouse in and out change
            if(!is_same){
                // Handle Mouse Out
                if(prev_object){
                    // Previous match should mouseout if:
                    const prev_mouseout = !object || !isNested(object, prev_object); // ( mouse goes to void ) || ( mouse goes to non-child )
                    // Fire mouseout events with bubble stopper current object, in case previous is child in current
                    if(prev_mouseout){
                        this.reuseEvent (event, target_event_props, "onMouseOut",   prev_object, object );
                        this.reuseEvent (event, target_event_props, "onMouseLeave", prev_object, object );
                        this.dispatchInternalEvent( event,          "hoverOut",     prev_object, object );
                    }
                }

                // Handle Mouse In
                if(object){
                    // Current object should mousein if:
                    // 1. Mouse comes from void, 2. Mouse comes from non child object
                    const current_mousein = !prev_object || !isNested(prev_object, object); // (mouse comes from void) || (mouse comes from non-child)
                    // Fire mousein events with bubble stopper prev object, in case current is child in prev
                    if(current_mousein){
                        this.reuseEvent (event, current_event_props, "onMouseOver",  object, prev_object );
                        this.reuseEvent (event, current_event_props, "onMouseEnter", object, prev_object );
                        this.dispatchInternalEvent( event,           "hoverIn",      object, prev_object );
                    }
                }
            }

            object && this.reuseEvent (event, current_event_props, "onMouseMove", object);

            // Handle dragging
            if(drag_start_event){

                const { events, ...new_dragover_stack } = resolveDragOverStack( current_event, current_event_props, drag_over_stack );

                for(let listenerName in (events)){
                    const target_events = events[listenerName];
                    for(let props of target_events.event_props) {
                        this.reuseEvent( target_events.event, {
                            ...props,
                            dragSource: drag_start_event_props,
                        }, listenerName, props.object );
                    }
                        

                }

                // Store the results
                drag_over_stack       = new_dragover_stack;
                drag_over_event       = new_dragover_stack.drag_over_event;
                drag_over_event_props = new_dragover_stack.drag_over_event_props;

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

    dispatchEvent( event, listenerName, target_object = event.intersection?.object, break_bubble_on ){
        let node = { parent: target_object };
        while(node = node.parent){
            if(node === break_bubble_on) return;
            (node.userData[listenerName])?.call(node, event);
            if(event.cancelBubble) return;
        }
    }

    // For effects like "hover", we need to find the handler not in
    dispatchInternalEvent( event, listenerName, target_object = event.intersection?.object, break_bubble_on ){
        let node = { parent: target_object };
        while(node = node.parent) {
            if(node === break_bubble_on) return;
            (node[listenerName])?.call(node, event);
        }
    }

    reuseEvent(event, { intersection = null, intersections = null, ray = null, dragTarget, dropTarget }, listenerName, target_object, break_bubble_on){
        event.intersection  = intersection;
        event.intersections = intersections;
        event.ray           = ray;
        event.renderer      = this;
        if(dragTarget) event.dragTarget = dragTarget;
        if(dropTarget) event.dropTarget = dropTarget;
        this.dispatchEvent(event, listenerName, target_object, break_bubble_on);
    }

    resolveEventMatch(event, objects){
        const raycaster = this.#raycaster;
        for(let { camera } of this.#scenes){
            if(!camera) return;
            event.camera = camera;
            this.updateRayCaster(event, camera);
            const intersections = raycaster.intersectObjects( objects, false );
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
        const index = objects.indexOf(mesh);
        index > -1 && objects.splice(index, 1);
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
