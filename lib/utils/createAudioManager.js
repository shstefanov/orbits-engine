import { useEffect } from "react";
import * as THREE    from "three";
import { PositionalAudioHelper } from 'three/addons/helpers/PositionalAudioHelper.js';

const p = {}, v = () => {};

function uePlaceholder1(){ useEffect(v, [p]) }

function applyNow(fn){ fn() }
const skip = { set: () =>{} };

export default function createAudioManager(sound, props, initialized, effects = []){

    if(initialized) return skip;

    props.hasOwnProperty("loop") && effects.push(
        !sound ? uePlaceholder1 : (({ loop }, apply) => apply( () => {
            console.log("loop", loop);
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

    props.hasOwnProperty("play") && effects.push(
        !sound ? uePlaceholder1 : (({ play }, apply) => apply( () => {
            play 
                ? (!sound.isPlaying && sound.play())
                : (sound.isPlaying  && sound.stop());
        }, [play]))
    );

    props.hasOwnProperty("maxDistance") && effects.push(
        !sound ? uePlaceholder1 : (({ maxDistance }, apply) => apply( () => {
            sound.setMaxDistance(maxDistance);
        }, [maxDistance]))
    );

    props.hasOwnProperty("refDistance") && effects.push(
        !sound ? uePlaceholder1 : (({ refDistance }, apply) => apply( () => {
            sound.setRefDistance(refDistance);
        }, [refDistance]))
    );

    props.hasOwnProperty("directionalCone") && effects.push(
        !sound ? uePlaceholder1 : (({ directionalCone }, apply) => apply( () => {
            sound.setDirectionalCone( ...directionalCone );
        }, [directionalCone]))
    );

    props.hasOwnProperty("rolloffFactor") && effects.push(
        !sound ? uePlaceholder1 : (({ rolloffFactor }, apply) => apply( () => {
            sound.setRolloffFactor( rolloffFactor );
        }, [rolloffFactor]))
    );

    props.hasOwnProperty("distanceModel") && effects.push(
        !sound ? uePlaceholder1 : (({ distanceModel }, apply) => apply( () => {
            sound.setDistanceModel( distanceModel );
        }, [distanceModel]))
    );

    props.hasOwnProperty("helper") && effects.push(
        !sound ? uePlaceholder1 : (({ helper }, apply) => apply( () => {
            console.log("helper", helper);
            if(helper) {
                sound.helper = new PositionalAudioHelper( sound, 0.1 );
                sound.add(sound.helper);
            }
            else {
                sound.remove(sound.helper);
                delete sound.helper;
            }

        }, [helper]))
    );

    return !effects.length ? skip : {
        set: function(props, apply = applyNow){
            if(sound) sound.userData = props;
            for(let effect of effects) effect(props, apply);
        }
    }
}