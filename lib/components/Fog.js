import React from "react";
import Object3Component from "../Object3Component";

import { Fog } from "three";

class OrbitsFog extends Object3Component {

	createElement(){
		const element = new Fog(
			this.props.color || "white",
			this.props.near  || 1,
			this.props.far   || 10000 
		);
		return element;
	}

	hasInteractions(){ return false; }
	handleScale(){     return false; }

	mountElement(){
		this.element = this.createElement();
		const el = this.element;
		if(this.props.id) el.name = this.props.id;

		const scene = this.props.overlay ? this.context.overlay : this.context.scene;
		scene.fog = el;

	}

	unmountElement(){
		const scene = this.props.overlay ? this.context.overlay : this.context.scene;
		scene.fog = null;
		scene.background = null;
	}

	UNSAFE_componentWillReceiveProps(nextProps){
		this.handleColor(nextProps.color);
		this.handleNear(nextProps.near);
		this.handleFar(nextProps.far);
	}

	handleColor(color){
		this.element.color.setHex( parseInt(color.replace("#", "0x"), 16) );
		const scene = this.props.overlay ? this.context.overlay : this.context.scene;
		scene.background = color || null;
	}

	handleNear(near = 1){
		this.element.near = near;
	}
	handleFar(far = 10000){
		this.element.far = far;
	}

}

export default OrbitsFog