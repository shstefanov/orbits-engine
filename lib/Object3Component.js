import React, { Component } from "react"
import {BoxHelper, DoubleSide, MeshBasicMaterial} from "three"
import Timer from "@orbits/timer";


// Detect if value is react component or react element
// https://stackoverflow.com/questions/33199959/how-to-detect-a-react-component-vs-a-react-element

const default0 = ({ x = 0, y = 0, z = 0 } = {}) => ({ x, y, z });
const default1 = ({ x = 1, y = 1, z = 1 } = {}) => ({ x, y, z });

const vecDiff = (base, target) => {
	return {
		x: target.x - base.x,
		y: target.y - base.y,
		z: target.z - base.z,
	};
}

const multiplyScalar = (vec, scalar) => ({ x: vec.x * scalar,  y: vec.y * scalar,  z: vec.z * scalar   });
const vecAdd         = (vec1, vec2)  => ({ x: vec1.x + vec2.x, y: vec1.y + vec2.y, z: vec1.z + vec2.z  });

const colorDiff = (col1, col2) => {
	return { r: col2.r - col1.r, g: col2.g - col1.g, b: col2.b - col1.b, };
}

const deconstructColor = (color) => {
	return {
		r: parseInt("0x" + color[1] + color[2], 16),
		g: parseInt("0x" + color[3] + color[4], 16),
		b: parseInt("0x" + color[5] + color[6], 16),
	}
}

const colorAdd = (c1, c2) => ({ r: c1.r + c2.r, g: c1.g + c2.g, b: c1.b + c2.b });
const multiplyColor = ({r,g,b}, n) => ({r : Math.round(r*n), g: Math.round(g*n), b: Math.round(b*n)});
const stringifyColor = ({r, g, b}) => {
	return "#" + [
		(r < 0x10 ? "0" : "" ) + r.toString(16),
		(g < 0x10 ? "0" : "" ) + g.toString(16),
		(b < 0x10 ? "0" : "" ) + b.toString(16),
	].join("");
}

const globalHandlers = {
	
	// Always bound events
	onMouseOver: function(e, props=this.props, markers=this.interactionCollider.userData.markers){
		// First enable all to get ahead of handlers exceptions
		e.target.userData.binds.enableMouseMove();
		e.target.userData.binds.enableMouseDown();
		e.target.userData.binds.enableMouseUp();
		e.target.userData.binds.enableClick();

		this.props.hover && this.setState({__hover: this.props.hover})

		// this.context.scene.setCursor(props.cursor);

		props.onMouseOver && props.onMouseOver(e);
		props.onMouseMove && props.onMouseMove(e);
		
	},

	onMouseOut: function(e, props=this.props, markers=this.interactionCollider.userData.markers){
		// First disable all to get ahead of handlers exceptions
		e.target.userData.binds.disableMouseMove();
		e.target.userData.binds.disableMouseUp();
		e.target.userData.binds.disableMouseDown();
		e.target.userData.binds.disableClick();

		this.setState({__hover: null})

		// this.context.scene.setCursor(null);

		props.onMouseOut && props.onMouseOut(e);
	},

	// Primary handlers (will be enabled after mouse enter and disabled after mouseout)
	onMouseDown: function(e, props=this.props, markers=this.interactionCollider.userData.markers){
		e.stopPropagation();
		markers.downButton = e.originalEvent.button;
		props.onMouseDown && props.onMouseDown(e);
		markers.awaitHold = setTimeout(() => {
			markers.awaitHold = 0;
			props.onHold && props.onHold(e);
			// Alter markers.downButton to prevent trigger click after mouseup
			markers.downButton = -1;
		}, 1000 );
	},

	onMouseUp: function(e, props=this.props, markers=this.interactionCollider.userData.markers){
		e.stopPropagation();
		markers.upButton = e.originalEvent.button;
		props.onMouseUp && props.onMouseUp(e);
		markers.enableClick && e.target.userData.binds.onClick(e);
		markers.awaitHold && clearTimeout(markers.awaitHold)
	},

	onMouseMove: function(e, props=this.props, markers=this.interactionCollider.userData.markers){
		e.stopPropagation();
		props.onMouseMove && props.onMouseMove(e);
	},

	// Artific
	onClick: function(e, props=this.props, markers=this.interactionCollider.userData.markers, binds=this.interactionCollider.userData.binds){

		if((markers.downButton !== markers.upButton)){
			markers.lastClick = 0;
			return;
		}

		switch(markers.upButton){
			case 0: {
				// Handle Double Click
				if(markers.lastClick && Date.now() - markers.lastClick < 150){
					props.onDoubleClick && props.onDoubleClick(e);
					markers.lastClick = 0;
				}
				// Handle single click
				else{
					markers.lastClick = Date.now();
					props.onClick && props.onClick(e);
				}
				break;
			}

			case 1: {
					markers.lastClick = 0;
					props.onMiddleClick && props.onMiddleClick(e);
					break;
			}
			case 2: {
					markers.lastClick = 0;
					props.onContext && props.onContext(e);
					break;
			}
		}
	},

	// Helper Function 
	enableMouseMove: function(){
		this.interactionCollider.addEventListener("mousemove", this.interactionCollider.userData.binds.onMouseMove);
	},
	
	disableMouseMove: function(){
		this.interactionCollider.removeEventListener("mousemove", this.interactionCollider.userData.binds.onMouseMove);
	},

	enableMouseDown: function(){
		this.interactionCollider.addEventListener("mousedown", this.interactionCollider.userData.binds.onMouseDown);
	},
	
	disableMouseDown: function(){
		this.interactionCollider.removeEventListener("mousedown", this.interactionCollider.userData.binds.onMouseDown);
	},

	enableMouseUp: function(){
		this.interactionCollider.addEventListener("mouseup", this.interactionCollider.userData.binds.onMouseUp);
	},
	
	disableMouseUp: function(){
		this.interactionCollider.removeEventListener("mouseup", this.interactionCollider.userData.binds.onMouseUp);
		const markers = this.interactionCollider.userData.markers
		markers.awaitHold && clearTimeout(markers.awaitHold)
		markers.awaitHold = 0;
	},

	enableClick: function(markers=this.interactionCollider.userData.markers){
		markers.enableClick=true;
		markers.lastClick = 0;
	},

	disableClick: function(markers=this.interactionCollider.userData.markers){
		markers.enableClick=false;
	},
};

const interactionPropsNames = [
	"hover",
	"cursor",
	"onClick",
	"onDoubleClick",
	"onMiddleClick",
	"onContext",
	"onHold",
	"onMouseDown",
	"onMouseUp",
	"onMouseOver",
	"onMouseOut",
	"onMouseMove",
	"onTouchStart",
	"onTouchCancel",
	"onTouchMove",
	"onTouchEnd",
	"interactive",
];

const handlerNames = Object.keys(globalHandlers);

class Object3Component extends Component {

	constructor(){
		super();
		this.state = {};
		this.timer_hooks = [];
	}

	render(){
		if(this.element){
			const render_context = {
				...this.context,
				scene: this.element
			};
			return React.createElement(
				OrbitsSceneProvider,
				{ value: render_context }, 
				...[
					this.state.__hover  || false,
					this.props.children || false,
				]
			);
		}
		else return null;
	}

	mountElement(){
		this.element = this.createElement();
		const el = this.element;
		if(!el) return;

		if(this.props.id) el.name = this.props.id;

		const scene = this.props.overlay ? this.context.overlay : this.context.scene;
		// TODO - handle position, rotation, lookAt
		scene.add(el);
	}

	hasInteractions(props=this.props){
		return interactionPropsNames.some( name => props.hasOwnProperty(name) );
	}

	mountInteraction(props=this.props){
		const el = this.element;
		if(!el || this.interactionCollider) return;
		const scene = this.context.main;
		this.interactionCollider = this.createInteraction() || el;
		this.interactionCollider.userData.props = props;
		this.interactionCollider.userData.binds = {};
		this.interactionCollider.userData.markers = {};
		// if(!props.debug) this.interactionCollider.material.visible = false;     // disabled due to using the element itself!
		// this.interactionCollider.material.side = DoubleSide;	     // disabled due to using the element itself!
		this.context.defer(() => {
			this.bindInteractions();
			this.context.interaction.add(this.interactionCollider);
		});
		// setTimeout(() => {
		// 	// this.element.add(this.interactionCollider);     // disabled due to using the element itself!
		// }, 0);
	}

	bindInteractions(){
		const object = this.interactionCollider;
		const binds = object.userData.binds;

		object.addEventListener("mouseover", ( binds.onMouseOver = globalHandlers.onMouseOver.bind(this)) );
		object.addEventListener("mouseout",  ( binds.onMouseOut  = globalHandlers.onMouseOut.bind(this)) );

		binds.onMouseDown = globalHandlers.onMouseDown.bind(this);
		binds.onMouseUp = globalHandlers.onMouseUp.bind(this);
		binds.onMouseMove = globalHandlers.onMouseMove.bind(this);

		binds.onClick = globalHandlers.onClick.bind(this);

		binds.enableMouseDown = globalHandlers.enableMouseDown.bind(this);
		binds.disableMouseDown = globalHandlers.disableMouseDown.bind(this);

		binds.enableMouseMove = globalHandlers.enableMouseMove.bind(this);
		binds.disableMouseMove = globalHandlers.disableMouseMove.bind(this);
		
		binds.enableMouseUp = globalHandlers.enableMouseUp.bind(this);
		binds.disableMouseUp = globalHandlers.disableMouseUp.bind(this);

		binds.enableClick = globalHandlers.enableClick.bind(this);
		binds.disableClick = globalHandlers.disableClick.bind(this);
	}

	unmountInteraction(){
		if(!this.interactionCollider) return;
		const collider = this.interactionCollider;
		const scene = this.context.interaction;
		scene.remove(collider);
		delete this.interactionCollider
	}

	updateInteraction(props=this.props){
		if(!this.interactionCollider) return;
		this.interactionCollider.userData.props = props;
	}

	unmountElement(){
		const el = this.element;
		if(!el) return;
		const scene = this.props.overlay ? this.context.overlay : this.context.scene;
		scene.remove(el);
	}

	UNSAFE_componentWillMount(){
		this.mountElement();
		if(this.hasInteractions()) {
			this.mountInteraction();
		}
		this.UNSAFE_componentWillReceiveProps(this.props)
	}

	componentWillUnmount(){
		this.unmountElement();
	  	this.unmountInteraction();
	  	for(let {cancel} of this.timer_hooks) cancel();
	}

	UNSAFE_componentWillReceiveProps(nextProps){
		this.handlePosition(nextProps.position);
		this.handleRotation(nextProps.rotation);
		this.handleScale(
			typeof nextProps.scale === "number"
			? { x: nextProps.scale, y: nextProps.scale, z: nextProps.scale }
			: nextProps.scale
		);
		this.handleColor(nextProps.color);
		this.handleTransition(nextProps.transition);
		this.handlePeriod(nextProps.period);
	}

	createElement(props)     { console.warn("No element to render, please, override SceneObject.createElement method") }
	createInteraction(props) { console.warn("No interaction collider to render, please, override SceneObject.createInteraction method (using BoxHelper as default)") }




	// Timer hooks


	at(...args){         this.timer_hooks.push( this.context.timer.at(...args) );         }
	period(...args){     this.timer_hooks.push( this.context.timer.period(...args) );     }
	transition(...args){ this.timer_hooks.push( this.context.timer.transition(...args) ); }
	interval(...args){   this.timer_hooks.push( this.context.timer.interval(...args) );   }




	// Position, rotation, scale

	handlePosition({ x = 0, y = 0, z = 0 } = {}){
		if(this.element){
			const el = this.element;
			el.position.x = x;
			el.position.y = y;
			el.position.z = z;
		}
	}


	handleRotation({ x = 0, y = 0, z = 0 } = {}){
		if(this.element){
			const el = this.element;
			el.rotation.x = x;
			el.rotation.y = y;
			el.rotation.z = z;
		}
	}

	handleScale({ x = 1, y = 1, z = 1 } = {}){
		if(this.element){
			const el = this.element;
			el.scale.x = x;
			el.scale.y = y;
			el.scale.z = z;
		}
	}

	handleColor(color="#888888"){
		if(this.material){
			this.material.color.setHex( parseInt(color.replace("#", "0x"), 16) );
		}
	}

	handleTransition(transition){
		if(!this.element || !transition) return; // No element or no transition defined, aborting...
		if(this.__transition) return;            // We have ongoing transition, aborting...
		let { duration, timing_function, from, to } = transition;

		switch(typeof timing_function){
			case "undefined": {
				timing_function = Timer.LINEAR;
				break;
			}
			case "string": {
				if(typeof Timer[transition.timing_function] !== "function"){
					throw new Error("Can't find timing function " + transition.timing_function);
				}
				timing_function = Timer[transition.timing_function]
				break;
			}
			case "function": break;

			default: throw new Error("Unsupported value for timing function: " + transition.timing_function);
		}



		const base = {
			position: default0(from.position),
			rotation: default0(from.rotation),
			scale:    default1(from.scale),
			color:    from.color ? deconstructColor(from.color) : false,
		}

		const diff = {
			position: vecDiff(base.position, default0(to.position)),
			rotation: vecDiff(base.rotation, default0(to.rotation)),
			scale:    vecDiff(base.scale,    default1(to.scale)),
			color:    from.color ? colorDiff(base.color, deconstructColor(to.color)) : false,
		}

		this.transition({
			duration,
			timing_function,
		}, (t, path) => {
			const result = {
				position: vecAdd(base.position, multiplyScalar(diff.position, path)),
				rotation: vecAdd(base.rotation, multiplyScalar(diff.rotation, path)),
				scale:    vecAdd(base.scale,    multiplyScalar(diff.scale,    path)),
				color:    from.color ? colorAdd(base.color, multiplyColor(diff.color, path)) : false
			};
			this.handlePosition(result.position);
			this.handleRotation(result.rotation);
			this.handleScale(result.scale);
			result.color && this.handleColor(stringifyColor(result.color));
		});
		this.__transition = true;
	}

	handlePeriod(period_settings){
		if(!this.element || !period_settings) return; // No element or no transition defined, aborting...
		if(this.__period) return;            // We have ongoing transition, aborting...
		let { period, from, to, timing_function } = period_settings;


		switch(typeof timing_function){
			case "undefined": {
				timing_function = Timer.LINEAR;
				break;
			}
			case "string": {
				if(typeof Timer[period_settings.timing_function] !== "function"){
					throw new Error("Can't find timing function " + period_settings.timing_function);
				}
				timing_function = Timer[period_settings.timing_function]
				break;
			}
			case "function": break;

			default: throw new Error("Unsupported value for timing function: " + period_settings.timing_function);
		}




		const base = {
			position: default0(from.position),
			rotation: default0(from.rotation),
			scale:    default1(from.scale),
			color:    from.color ? deconstructColor(from.color) : false,
		}

		const diff = {
			position: vecDiff(base.position, default0(to.position)),
			rotation: vecDiff(base.rotation, default0(to.rotation)),
			scale:    vecDiff(base.scale,    default1(to.scale)),
			color:    from.color ? colorDiff(base.color, deconstructColor(to.color)) : false,
		}

		this.period(period, (t, path) => {
			const value = timing_function(path);
			const result = {
				position: vecAdd(base.position, multiplyScalar(diff.position, value)),
				rotation: vecAdd(base.rotation, multiplyScalar(diff.rotation, value)),
				scale:    vecAdd(base.scale,    multiplyScalar(diff.scale,    value)),
				color:    from.color ? colorAdd(base.color, multiplyColor(diff.color, path)) : false
			};
			this.handlePosition(result.position);
			this.handleRotation(result.rotation);
			this.handleScale(result.scale);
			result.color && this.handleColor(stringifyColor(result.color));
		});
		this.__period = true;
	}

}


Object3Component.contextType = React.createContext({});
export const OrbitsSceneProvider = Object3Component.contextType.Provider;

export default Object3Component