import React from "react"
import Object3Component from "../Object3Component";
import { Audio, AudioListener, AudioLoader } from "three";

export default class AudioComponent extends Object3Component {

	hasInteractions(){ return false; }

	createElement(){
		const { src, play, loop, volume } = this.props;

		const sound = this.sound = new Audio( this.context.audioListener );

		const audioLoader = new AudioLoader();

		audioLoader.load( src, buffer => {
			sound.setBuffer( buffer );
			sound.setLoop( loop );
			sound.setVolume( volume );
			play ? sound.play() : sound.pause();
		});

	}

	unmountElement(){
		this.sound.stop();
	}

}