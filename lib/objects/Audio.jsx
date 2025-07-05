import React, { useState, useEffect, createContext, useContext, useMemo } from "react";
import * as THREE from "three";
import { useRenderer } from "../OrbitsRenderer";
import createAudioManager from "../utils/createAudioManager";

const empty = [];


export default function Audio(props){

    const renderer = useRenderer(); // available:  renderer.audioListener, renderer.audioLoader
    const [ sound,   setSound   ] = useState(null);
    const [ manager, setManager ] = useState(createAudioManager(sound, props, false));

    useEffect( () => {
        if(!props.src) {
            setSound(null);
            setManager( createAudioManager(null, props, false) );
            return;
        }

        const sound = new THREE.Audio(renderer.audioListener);

        // Currently, it creates new audio object when src is changed
        props.onCreate && props.onCreate(sound);

        renderer.audioLoader.load( props.src, function( buffer ) {
            sound.setBuffer( buffer );
            const manager = createAudioManager(sound, props, false);
            manager.set(props);
            setManager(manager);
            setSound(sound);
        });


        return () => sound.disconnect();
    }, [ props.src ]);

    manager.set(props, useEffect);

    return null;
}