import React, { useState, useEffect, useRef, useMemo } from "react";
import * as THREE         from "three";
import { PositionalAudioHelper } from 'three/addons/helpers/PositionalAudioHelper.js';
import { useRenderer }    from "../OrbitsRenderer";
import createAudioManager from "../utils/createAudioManager";
import Group              from "../Group";
import useCamera          from "../cameras/useCamera";

const empty = [];

const buffersCache = new Map();

export default function Audio(props){

    const renderer = useRenderer(); // available:  renderer.audioListener, renderer.audioLoader

    const [ sound, setSound ] = useState(null);
    const soundRef = useRef(null);
    const skipManager = useMemo( () => createAudioManager(null, props, false), []);

    const [ manager, setManager ] = useState(createAudioManager(sound, props, false));

    useEffect( () => {

        if(sound) { sound.stop(); sound.disconnect(); }

        if(!props.src) {
            if(sound){
                sound.stop();
                sound.dicconnect();
                soundRef.current = null;
                setManager( skipManager );
                setSound(null);
            }
            return;
        }

        let canceled = false;

        const SoundPrototype = props.SoundPrototype || THREE.Audio;

        const new_sound = new SoundPrototype(props.listener || renderer.audioListener);
        const manager = createAudioManager(new_sound, props, false);

        if(!props.hasOwnProperty("autoplay")) new_sound.autoplay = true;
        else new_sound.autoplay = props.autoplay;

        // Currently, it creates new audio object when src is changed
        props.onCreate && props.onCreate(new_sound);

        function applyBuffer(buffer){

            if(canceled) return;
            
            // In some cases component is unmounted before loading is done
            if(skipManager.unmounted){
                new_sound.disconnect();
                return;
            }

            new_sound.setBuffer( buffer );

            if(!new_sound.autoplay){
                if(new_sound.isPlaying) return;
                if(props.hasOwnProperty("play")) if(props.play) new_sound.play();
                else sound.play();
            }

            soundRef.current = new_sound;
            setSound(new_sound);
            setManager( manager );

            SoundPrototype !== THREE.PositionalAudio && manager.set(props); // Immediate apply props
        }

        if(renderer.cache.has(props.src)) applyBuffer(renderer.cache.get(props.src));
        else renderer.audioLoader.load( props.src, buffer => {
            renderer.cache.set(props.src, buffer);
            applyBuffer(buffer);
        });

        return () => { canceled = true; }

    }, [ props.src ]);

    useEffect( () => () => {
        skipManager.unmounted = true; // Will be used in case loading is done after component unmount
        if(soundRef.current) {
            if(props.isEffect && soundRef.current.isPlaying) soundRef.current.onEnded( () => soundRef.current.disconnect() );
            else soundRef.current.disconnect();
        }
    }, [] );

    props.SoundPrototype !== THREE.PositionalAudio && manager.set(props, useEffect);

    return null;
}


export function AudioEffect ({play, autoplay, ...props}){
    return <Audio { ...props } isEffect play autoplay />;
}

const defaultPosition = { x: 0, y: 0, z: 0 };
export function PositionalAudio ({ position = defaultPosition, children, ...props }){

    const renderer = useRenderer();
    const camera = useCamera();

    const [ mesh,  setMesh  ] = useState(null);
    const [ sound, setSound ] = useState(null);

    const [ manager, setManager ] = useState(createAudioManager(sound, props, false));

    useEffect( () => {
        if(!mesh)  return;
        if(!sound) return;

        if(!camera.audioListener) {
            camera.add( camera.audioListener = new THREE.AudioListener() );
        }

        sound.panner.panningModel = "equalpower";

        mesh.add(sound);

        const manager = createAudioManager(sound, props, false);
        manager.set(props);
        setManager(manager);
        renderer.render();
        return () => {
            mesh.remove(sound);
            renderer.render();
        }
    }, [ mesh, sound ]);

    manager.set(props, useEffect);
    
    return <Group position = { position } onCreate = { setMesh }>
        { mesh && <Audio
          onCreate={ setSound }
          listener = { camera.audioListener }
          SoundPrototype = { THREE.PositionalAudio }
          { ...props }
        /> }
        { children }
    </Group>;
}

