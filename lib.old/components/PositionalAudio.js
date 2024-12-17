import React from "react"
import Object3Component from "../Object3Component";
import { PositionalAudio, AudioListener, AudioLoader } from "three";

export default class PositionalAudioComponent extends Object3Component {

	hasInteractions(){ return false; }

	createElement(){
		const { src, play, loop, volume, refDistance } = this.props;

		const sound = this.sound = new PositionalAudio( this.context.audioListener );

		const audioLoader = new AudioLoader();

		audioLoader.load( src, buffer => {
			sound.setBuffer( buffer );
			sound.setLoop( loop );
			sound.setRefDistance( refDistance );
			sound.setVolume( volume );
			play ? sound.play() : sound.pause();
		});

		return sound;
	}

	unmountElement(){
		this.sound.stop();
	}

}