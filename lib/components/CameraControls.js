import React from "react"
import Object3Component from "../Object3Component";
import { Group } from "three";

export default class CameraControlsScope extends Object3Component {
	hasInteractions(){ return false; }
	createElement(){ 
		return null;
	}

	UNSAFE_componentWillReceiveProps({onUpdateControls, ...nextProps}){
		this.context.setCameraControls(nextProps);
		onUpdateControls && this.context.controls.addEventListener( "update", this._onUpdateControls = onUpdateControls);
	}

	componentWillUnmount(){
		this._onUpdateControls && this.context.controls.removeEventListener( "update", this._onUpdateControls);
		this.context.setCameraControls(null);
	}
}