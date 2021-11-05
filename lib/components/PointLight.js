import React from "react"
import AbstractLightComponent from "./abstract/AbstractLightComponent"
import { PointLight } from "three";

class OrbitsPointLightComponent extends AbstractLightComponent {

	createElement(){
		return new PointLight(
			this.props.color ?  parseInt(this.props.color.replace("#", "0x"), 16) : 0xffffff,
			this.props.intensity || 1,
			this.props.distance  || 10000,
			2
		);
	}

}

export default OrbitsPointLightComponent