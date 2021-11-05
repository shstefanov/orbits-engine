import React from "react"
import AbstractLightComponent from "./abstract/AbstractLightComponent"
import { AmbientLight } from "three";

class OrbitsAmbientLightComponent extends AbstractLightComponent {

	createElement(){
		return new AmbientLight(
			this.props.color ?  parseInt(this.props.color.replace("#", "0x"), 16) : 0xffffff,
			this.props.intensity || 1
		);
	}

}

export default OrbitsAmbientLightComponent