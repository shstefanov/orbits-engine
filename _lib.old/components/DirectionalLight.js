import React from "react"
import AbstractLightComponent from "./abstract/AbstractLightComponent"
import { DirectionalLight } from "three";

class OrbitsDirectionalLightComponent extends AbstractLightComponent {

	createElement(){
		return new DirectionalLight(
			this.props.color ?  parseInt(this.props.color.replace("#", "0x"), 16) : 0xffffff,
			this.props.intensity || 1
		);
	}

}

export default OrbitsDirectionalLightComponent;