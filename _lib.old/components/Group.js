import React from "react"
import Object3Component from "../Object3Component";
import { Group } from "three";

export default class OrbitsGroup extends Object3Component {
	hasInteractions(){ return false; }
	handleColor(){  }
	componentDidMount(){
		
	}
	createElement(){ 
		setTimeout(() => {
			this.setState({___init: Math.random()})
		}, 100);
		return new Group();

	}
}