import Object3Component from "../../Object3Component"
import {Group} from "three";

export default class AbstractLightComponent extends Object3Component {
	
	// @override
	hasInteractions(){ return false; }
	handleScale(){     return false; }

	mountElement(){
		super.mountElement();
		if(!this.props.target) return;
		if(typeof this.props.target === "string"){
			setTimeout(() => {
				const target = this.context.scene.getObjectByName(this.props.target);
				if(target) this.element.target = target;
			});
		}
		else {
			this.element.target = new Group();
			this.context.scene.add(this.element.target);
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps){
		this.handlePosition(nextProps.position);
		this.handleRotation(nextProps.rotation);
		this.handleColor(nextProps.color);
		this.handleIntensity(nextProps.intensity);
		this.handleDistance(nextProps.distance);
		this.handleAngle(nextProps.angle);
		this.handlePenumbra(nextProps.penumbra);
		this.handleTransition(nextProps.transition);
		this.handlePeriod(nextProps.period);
		this.handleTarget(nextProps.target);
	}

	handleColor(color){
		this.element.color.setHex( parseInt(color.replace("#", "0x"), 16) );
	}

	handleIntensity(intensity=1){
		this.element.intensity = intensity;
	}

	handleDistance(distance=10000){
		this.element.distance = distance;
	}

	handleAngle(angle = Math.PI / 2){
		this.element.angle = angle;
	}

	handlePenumbra(penumbra = 0.5){
		this.element.penumbra = penumbra;
	}

	handleTarget(target=null){
		if(!target) return;
		if(target === this.props.target) return;
		if(typeof target === "object"){
			Object.assign(this.element.target.position, target);
		}
		else{
			setTimeout(() => {
				const target = this.context.scene.getObjectByName(target);
				if(target) this.element.target = target;
			});
		}
	}


}