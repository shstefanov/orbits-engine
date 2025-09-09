import React, { createContext, useContext, useEffect, useState } from "react";
import OrbitsTimer from "@orbits/timer";
import { useRenderer } from "./OrbitsRenderer";

const timerContext = createContext();
export const useTimer = () => useContext(timerContext);

export default function Timer(props){

    const renderer = useRenderer();

    if(!renderer.relTimer){ // Setting the timer ass soon as possible
        renderer.relTimer = new OrbitsTimer(props);
        renderer.relTimer.start(10, tick => {/* This just blocks automatic timer loop */});
    }

    const { speed = 1 } = props;

    useEffect( () => {
        return () => {
            renderer.relTimer.stop();
            renderer.relTimer.reset();
            delete renderer.relTimer;
        }
    }, []);

    useEffect(() => { renderer.relTimer.set({ speed }); }, [speed]);

    return <timerContext.Provider value={renderer.relTimer}>
        { props.children }
    </timerContext.Provider>;
}
