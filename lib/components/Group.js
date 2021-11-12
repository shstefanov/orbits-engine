import React from "react"
import Object3Component from "../Object3Component";
import { Group } from "three";

export default class OrbitsGroup extends Object3Component {
	hasInteractions(){ return false; }
	handleColor(){  }
	createElement(){ 
		setTimeout(() => {
			this.setState({___init: Math.random()})
		}, 0);
		return new Group();

	}
}