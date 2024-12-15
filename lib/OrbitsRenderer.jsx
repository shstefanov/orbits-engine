import React, { useState, useEffect, createContext, useContext } from "react";

import * as THREE from 'three';

const rendererContext    = createContext();
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
        setRenderer(renderer);
        return () => renderer.dispose();
    }, []);

    // In case we need to create and mount canvas domElement
    !options.canvas && useEffect( () => {
        if(!canvas) return;
        const renderer = new THREE.WebGLRenderer({...options, canvas});
        setRenderer(renderer);
        return () => renderer.dispose();
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
            function setSize(){

                if(t) clearTimeout(t);

                t = setTimeout(() => {
                    const { width, height } = getSize((canvas||options.canvas));
                    console.log("SETSIZE: ", width, height);
                    renderer.setSize( width, height, false );
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