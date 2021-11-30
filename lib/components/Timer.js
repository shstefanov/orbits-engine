import React from "react"
import Object3Component, { OrbitsSceneProvider } from "../Object3Component";
import Timer from "@orbits/timer";

export default class OrbitsTimer extends Object3Component {

	hasInteractions(){ return false; }

	render(){
		if(this.timer){
			// Creating new context should allow us to nest the objects in the scene
			const render_context = { ...this.context, timer: this.timer };
			return React.createElement(
				OrbitsSceneProvider,
				{ value: this.timerContext },
				this.props.children || false,  // Adding actual children
			);
		}
		else return null;
	}

	UNSAFE_componentWillMount(){
		this.timer = new Timer(this.props);
		this.timerContext = {
			...this.context,
			timer: this.timer
		}
		this.context.nestedTimers.add(this.timer);
	}

	UNSAFE_componentWillReceiveProps(nextProps){
		this.timer.set(nextProps);
	}

	createElement(){ return null; }

	componentWillUnmount(){
		this.context.nestedTimers.delete(this.timer);
	}

}