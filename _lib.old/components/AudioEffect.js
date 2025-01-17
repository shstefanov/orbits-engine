import React from "react"
import Object3Component from "../Object3Component";
import { Audio, AudioListener, AudioLoader } from "three";

const cache = new Map();

export default class AudioEffectComponent extends Object3Component {

	hasInteractions(){ return false; }

	createElement(){
		const { src, play, loop, volume } = this.props;

		const sound = this.sound = new Audio( this.context.audioListener );

		const playBuffer = buffer => {
			sound.setBuffer( buffer );
			sound.setLoop( loop );
			sound.setVolume( volume );
			play ? sound.play() : sound.pause();
		}

		if(this.context.audioCache.has(src)) {
			playBuffer(this.context.audioCache.get(src));
		}
		else {
			const audioLoader = new AudioLoader();
			audioLoader.load( src, buffer => {
				this.context.audioCache.set(src, buffer);
				playBuffer(buffer);
			});
		}

	}

	unmountElement(){
		// this.sound.stop();
	}

}