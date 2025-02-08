import React, { createContext, useContext } from "react";
import TimerClass from "@orbits/timer";

const timerContext = createContext();
export const useTimer = () => useContext(timerContext);



export default function Timer(){
    return null;
}





class OrbitsTimer extends TimerClass {


    // Remake start method as original uses only requestAnimationFrame

    start(min_step = 40, raf){
        if(!raf) return super.start(min_step);
        if(this.tick) return;
        let now = Date.now();
        const state = this.getState(now);
        this.handleState(state);
        this.state = state;
        this.tick = () => {
            const new_now = Date.now();
            const delta = new_now - now;
            if(delta >= min_step){
                const state = this.getState(new_now);
                this.handleState(state);
                this.state = state;
                now = new_now;
            }
            this.tick && raf(this.tick);
        }
        this.tick.baseInterval = min_step;
        raf(this.tick);
    }



}