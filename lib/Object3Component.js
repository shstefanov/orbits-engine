import React, { Component, Fragment } from "react";
import Timer from "@orbits/timer";
import * as THREE from "three";

import {
	convertMaterialProps,
	fillDefaultXYZ,
	vecAdd,
	vecDiff,
	multiplyScalar,
	colorDiff,
	deconstructColor,
	colorAdd,
	multiplyColor,
	stringifyColor,
	interactionHandlers,
	interactionPropsNames,
	extractMaterialTransitionValues,
	materialDiff,
	materialStep,
} from "./utils";

const {
	BoxHelper,
	MaterialLoader, FrontSide, BackSide, DoubleSide,
	TextureLoader,
	MeshPhongMaterial, // Needed as default material
	ImageUtils,
} = THREE;


// Detect if value is react component or react element
// https://stackoverflow.com/questions/33199959/how-to-detect-a-react-component-vs-a-react-element

class Object3Component extends Component {

	constructor(){
		super();
		this.state = {};
		this.timer_hooks = [];
	}

	// Here starts mounting of threejs element
	UNSAFE_componentWillMount(){
		this.loadElement(
			this.props.geometry,
			this.props.material,
		).then( () => {
			this.mountElement();
			if(this.element){
				this.props.hasOwnProperty("castShadow")    && (this.element.castShadow    = this.props.castShadow    );
				this.props.hasOwnProperty("receiveShadow") && (this.element.receiveShadow = this.props.receiveShadow );
				this.element.needsUpdate = true;
			}
			this.mountInteraction();
			this.UNSAFE_componentWillReceiveProps(this.props);
			this.props.debug && console.log(this.constructor.name, this.props.id, {
				hasInteractions: this.hasInteractions(this.props),
				element: this.element,
				props: { ...this.props },
			});
		});
	}

	// Here will be handled sync or async model loading
	async loadElement(geometry, material){
		// Load geometry from url if it is specified
		if(geometry && typeof geometry === "string") await this.loadGeometry();

		if(material){

			if(Array.isArray(material)) this.material = [];
			else material = [ material ];
			// TODO: Use Promise.all() for faster loading
			for(let material_data of material){
				// Load material from url
				if(typeof material_data === "string" || material_data.src) {
					const src = typeof material_data === "string" ? material_data : material_data.src;
					const props = typeof material_data === "string" ? {} : material_data;
					await this.loadMaterial(src, props);
				}
				else if(material_data.type === "WireframeMaterial"){
					const mat_element = new THREE.WireframeMaterial(this.geometry);
					if(Array.isArray(this.material)) this.material.push(mat_element);
					else this.material = mat_element;
				}
				else {
					const {textures, ...props} = material_data;
					const maps = {};
					if(textures){
						for(let mapName in textures){
							// TODO: Use Promise.all() for faster loading
							maps[mapName] = await this.loadTexture(textures[mapName]);
						}
					}
					this.createMaterial({...props, textures: maps});
				}
			}
		}
	}

	// Creates material from provided object
	createMaterial({ type, textures, ...props}){
		const Proto = THREE[type] || THREE.MeshPhongMaterial;
		const mat_element = new Proto(convertMaterialProps(props, textures));
		if(Array.isArray(this.material)) this.material.push(mat_element);
		else this.material = mat_element;


		
	}

	loadTexture(src){


		if(src.indexOf("data:image") === 0){
			return ImageUtils.loadTexture( src );
		}

		return new Promise( (done, reject) => {
			(new TextureLoader()).load( src, texture => {
				done(texture);
			}, xhr => {}, 
			err => reject(err)
			);
		})


	}

	async loadMaterial(src, props){
		const mat_element = await ( new Promise( (resolve, reject) => {
			const loader = new MaterialLoader();
			loader.load(
				src,
				material => resolve(material),
				xhr => {},
				err => reject(err)
			);
		}));
		props && Object.assign(mat_element, props);
		if(Array.isArray(this.material)) this.material.push(mat_element);
		else this.material = mat_element;
	}

	// Should override this method for specific types of models
	async loadGeometry(){
		// const src = this.props.geometry;
		// this.geometry = await ( new Promise( (resolve, reject) => {
		// 	const loader = new MaterialLoader();
		// 	loader.load(
		// 		src,
		// 		material => resolve(material),
		// 		xhr => {},
		// 		err => reject(err)
		// 	);
		// }));
	}

	render(){
		if(this.element){
			// Creating new context should allow us to nest the objects in the scene
			const render_context = { ...this.context, scene: this.element };
			return React.createElement(
				OrbitsSceneProvider,
				{ value: render_context }, 
				this.state.__hover  || false,  // Adding hover components as children
				this.props.children || false,  // Adding actual children
				// ...[]
			);
		}
		else if(this.props.children){
			// Even without element, component still may have nested children to render
			return React.createElement(Fragment, {}, this.props.children);
		}
		else return null;
	}

	// Mounting element
	mountElement(){
		this.element = this.createElement();
		const el = this.element;
		if(!el) return;

		if(this.props.id) el.name = this.props.id;

		const scene = this.props.overlay ? this.context.overlay : this.context.scene;

		// Attaching position to parent object position
		if(this.props.overlay){
			 // el.position.copy(this.context.scene.position);
			 this.context.scene.getWorldPosition(el.position);
		}

		this.UNSAFE_componentWillReceiveProps(this.props);

		scene.add(el);
	}
	// Unmount element
	unmountElement(){
		if(this.element) this.element.parent.remove(this.element);
	}

	hasInteractions(props=this.props){
		return interactionPropsNames.some( name => props.hasOwnProperty(name) );
	}

	mountInteraction(props=this.props){

		if(!this.hasInteractions()) return;
		const el = this.element;
		if(!el || this.interactionCollider) return;
		this.interactionCollider = this.createInteraction() || el;
		this.interactionCollider.userData.props = props;
		this.interactionCollider.userData.binds = {};
		this.interactionCollider.userData.markers = {};
		// if(!props.debug) this.interactionCollider.material.visible = false;     // disabled due to using the element itself!
		// this.interactionCollider.material.side = DoubleSide;	     // disabled due to using the element itself!
		this.context.defer(() => {
			this.bindInteractions();
			this.props.debug && console.log(this.constructor.name, "ADD COLLIDER TO INTERACTION MANAGER");
			this.context.interaction.add(this.interactionCollider);
		});
		// setTimeout(() => {
		// 	// this.element.add(this.interactionCollider);     // disabled due to using the element itself!
		// }, 0);
	}

	bindInteractions(){
		const object = this.interactionCollider;
		if(!object) return;
		const binds = object.userData.binds;

		object.addEventListener("mouseover", ( binds.onMouseOver = interactionHandlers.onMouseOver.bind(this)) );
		object.addEventListener("mouseout",  ( binds.onMouseOut  = interactionHandlers.onMouseOut.bind(this)) );

		binds.onMouseDown      = interactionHandlers.onMouseDown.bind(this);
		binds.onMouseUp        = interactionHandlers.onMouseUp.bind(this);
		binds.onMouseMove      = interactionHandlers.onMouseMove.bind(this);

		binds.onClick          = interactionHandlers.onClick.bind(this);

		binds.enableMouseDown  = interactionHandlers.enableMouseDown.bind(this);
		binds.disableMouseDown = interactionHandlers.disableMouseDown.bind(this);

		binds.enableMouseMove  = interactionHandlers.enableMouseMove.bind(this);
		binds.disableMouseMove = interactionHandlers.disableMouseMove.bind(this);
		
		binds.enableMouseUp    = interactionHandlers.enableMouseUp.bind(this);
		binds.disableMouseUp   = interactionHandlers.disableMouseUp.bind(this);

		binds.enableClick      = interactionHandlers.enableClick.bind(this);
		binds.disableClick     = interactionHandlers.disableClick.bind(this);
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



	defaultMaterial(){
		const color = parseInt(((this.props.material || {}).color || "#aaaaaa").replace("#", "0x"), 16);
		return new MeshPhongMaterial({color});
	}



	// async loadElement(){
	// 	( typeof this.props.material === "string" ) && await this.loadMaterial();
	// 	( typeof this.props.geometry === "string" ) && await this.loadGeometry();
	// }

	// UNSAFE_componentWillMount(){
	// 	this.loadElement().then( () => {
	// 		this.mountElement();
	// 		this.mountInteraction();
	// 		this.UNSAFE_componentWillReceiveProps(this.props);
	// 	});
	// }

	componentWillUnmount(){
		this.unmountElement();
		this.unmountInteraction();
		for(let {cancel} of this.timer_hooks) cancel();
		this.context.controls.enabled = true;
	}

	UNSAFE_componentWillReceiveProps(nextProps){
		this.handlePosition(nextProps.position);
		this.handleRotation(nextProps.rotation);
		this.handleScale(
			typeof nextProps.scale === "number"
			? { x: nextProps.scale, y: nextProps.scale, z: nextProps.scale }
			: nextProps.scale
		);
		this.handleTransition(nextProps.transition);
		this.handlePeriod(nextProps.period);
		this.handleMaterial(nextProps.material);
		this.handleRelTransition(nextProps.relTransition);
		this.handleRelPeriod(nextProps.relPeriod);
		nextProps.hasOwnProperty("freezeControls") && this.handleFreezeControls(nextProps.freezeControls);

	}

	createElement(props)     { console.warn("No element to render, please, override SceneObject.createElement method") }
	createInteraction(props) {
		// console.warn("No interaction collider to render, please, override SceneObject.createInteraction method (using BoxHelper as default)")
	}


	createTransitionFunction(from, to){

		const base = {
			position:      from.position && fillDefaultXYZ(0, from.position),
			rotation:      from.rotation && fillDefaultXYZ(0, from.rotation),
			scale:         from.scale    && fillDefaultXYZ(1, from.scale),
			material:      from.material && extractMaterialTransitionValues(from.material || {}),
		};

		const diff = {
			position: from.position && vecDiff(base.position, fillDefaultXYZ(0, to.position)),
			rotation: from.rotation && vecDiff(base.rotation, fillDefaultXYZ(0, to.rotation)),
			scale:    from.scale    && vecDiff(base.scale,    fillDefaultXYZ(1, to.scale)),
			material: from.material && materialDiff(base.material, extractMaterialTransitionValues(to.material)),
		}

		return path => {
			return {
				...(base.position ?  { position: vecAdd(base.position, multiplyScalar(diff.position, path)) } : {} ),
				...(base.rotation ?  { rotation: vecAdd(base.rotation, multiplyScalar(diff.rotation, path)) } : {} ),
				...(base.scale    ?  { scale:    vecAdd(base.scale,    multiplyScalar(diff.scale, path)) }    : {} ),
				...(base.material ?  { material: materialStep(base.material, diff.material, path)} : {})
			};
		}
	}




	// Timer hooks
	at(...args){            this.timer_hooks.push( this.context.timer.at(...args) );            }
	interval(...args){      this.timer_hooks.push( this.context.timer.interval(...args) );      }
	period(...args){        this.timer_hooks.push( this.context.timer.period(...args) );        }
	transition(...args){    this.timer_hooks.push( this.context.timer.transition(...args) );    }
	relAt(...args){         this.timer_hooks.push( this.context.timer.relAt(...args) );         }
	relInterval(...args){   this.timer_hooks.push( this.context.timer.relInterval(...args) );   }
	relPeriod(...args){     this.timer_hooks.push( this.context.timer.relPeriod(...args) );     }
	relTransition(...args){ this.timer_hooks.push( this.context.timer.relTransition(...args) ); }


	// Position, rotation, scale
	handleMaterial(material){
		if(Array.isArray(this.material)){
			for(let i=0; i<this.material.length; i++){
				Object.assign(this.material[i], convertMaterialProps(material[i]));
			} 
		}
		else if(this.material && typeof material === "object"){
			Object.assign(this.material, convertMaterialProps(material));
			this.material.needsUpdate = true;
		}
	}

	handlePosition(position){
		if(this.element && position){
			const { x = 0, y = 0, z = 0 } = position;
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

	handleOpacity(opacity){
		if(typeof opacity === "number" && this.material){
			this.material.opacity = opacity;
		}
	}

	handleTransition(transition){
		if(!this.element || !transition) return; // No element or no transition defined, aborting...
		if(this.__transition) return;            // We have ongoing transition, aborting...
		let { duration, timing_function, from, to, handle } = transition;
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

		const transition_function = this.__transition = handle || this.createTransitionFunction(from, to);

		this.transition({ duration, timing_function }, (t, path) => {
			const { material, position, rotation, scale } = transition_function(path);
			material && this.handleMaterial(material);
			position && this.handlePosition(position);
			rotation && this.handleRotation(rotation);
			scale    && this.handleScale(scale);
			if(path === 1) delete this.__transition;
		});
	}

	handlePeriod(period_settings){
		if(!this.element || !period_settings) return; // No element or no transition defined, aborting...
		if(this.__transition) return;            // We have ongoing transition, aborting...
		let { period, from, to, timing_function, handle } = period_settings;

		switch(typeof timing_function){
			case "undefined": {
				timing_function = Timer.LINEAR;
				break;
			}
			case "string": {
				if(typeof Timer[period_settings.timing_function] !== "function"){
					throw new Error("Can't find timing function " + period_settings.timing_function);
				}
				timing_function = Timer[period_settings.timing_function];
				break;
			}
			case "function": break;

			default: throw new Error("Unsupported value for timing function: " + transition.timing_function);
		}
		const transition_function = this.__transition = handle || this.createTransitionFunction(from, to);
		this.period( period, (t, p) => {
			const path = timing_function(p);
			const { material, position, rotation, scale } = transition_function(path);
			material && this.handleMaterial(material);
			position && this.handlePosition(position);
			rotation && this.handleRotation(rotation);
			scale    && this.handleScale(scale);
			if(path === 1) delete this.__transition;
		});
	}

	handleRelTransition(transition){
		if(!this.element || !transition) return; // No element or no transition defined, aborting...
		if(this.__transition) return;            // We have ongoing transition, aborting...
		let { duration, timing_function, from, to, handle } = transition;
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
		const transition_function = this.__transition = handle || this.createTransitionFunction(from, to);
		this.relTransition({ duration, timing_function }, (t, path) => {
			const { material, position, rotation, scale } = transition_function(path);
			material && this.handleMaterial(material);
			position && this.handlePosition(position);
			rotation && this.handleRotation(rotation);
			scale    && this.handleScale(scale);
		});
	}

	handleRelPeriod(period_settings){
		if(!this.element || !period_settings) return; // No element or no transition defined, aborting...
		if(this.__transition) return;            // We have ongoing transition, aborting...
		let { period, from, to, timing_function, handle } = period_settings;



		switch(typeof timing_function){
			case "undefined": {
				timing_function = Timer.LINEAR;
				break;
			}
			case "string": {
				if(typeof Timer[period_settings.timing_function] !== "function"){
					throw new Error("Can't find timing function " + period_settings.timing_function);
				}
				timing_function = Timer[period_settings.timing_function];
				break;
			}
			case "function": break;

			default: throw new Error("Unsupported value for timing function: " + transition.timing_function);
		}
		const transition_function = this.__transition = handle || this.createTransitionFunction(from, to);
		this.relPeriod( period, (t, p) => {
			const path = timing_function(p);
			const { material, position, rotation, scale } = transition_function(path);
			material && this.handleMaterial(material);
			position && this.handlePosition(position);
			rotation && this.handleRotation(rotation);
			scale    && this.handleScale(scale);
			if(path === 1) delete this.__transition;
		});
	}

	handleFreezeControls(freezeControls){
		this.context.controls.enabled = !freezeControls;
	}

}


Object3Component.contextType = React.createContext({});
export const OrbitsSceneProvider = Object3Component.contextType.Provider;

export default Object3Component