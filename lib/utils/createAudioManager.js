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

export default function createAudioManager(sound, props, initialized, effects = []){

    if(initialized) return skip;

    props.hasOwnProperty("play") && effects.push(
        !sound ? uePlaceholder1 : (({ play }, apply) => apply( () => {
            play ? sound.play(play) : sound.stop();
        }, [play]))
    );

    props.hasOwnProperty("loop") && effects.push(
        !sound ? uePlaceholder1 : (({ loop }, apply) => apply( () => {
            sound.setLoop(loop);
        }, [loop]))
    );

    props.hasOwnProperty("volume") && effects.push(
        !sound ? uePlaceholder1 : (({ volume }, apply) => apply( () => {
            sound.setVolume(volume);
        }, [volume]))
    );

    props.hasOwnProperty("loopStart") && effects.push(
        !sound ? uePlaceholder1 : (({ loopStart }, apply) => apply( () => {
            sound.setLoopStart(loopStart);
        }, [loopStart]))
    );

    props.hasOwnProperty("loopEnd") && effects.push(
        !sound ? uePlaceholder1 : (({ loopEnd }, apply) => apply( () => {
            sound.setLoopEnd(loopEnd);
        }, [loopEnd]))
    );

    props.hasOwnProperty("playbackRate") && effects.push(
        !sound ? uePlaceholder1 : (({ playbackRate }, apply) => apply( () => {
            sound.setPlaybackRate(playbackRate);
        }, [playbackRate]))
    );
    

    return !effects.length ? skip : {
        set: function(props, apply = applyNow){
            if(sound) sound.userData = props;
            for(let effect of effects) effect(props, apply);
        }
    }
}