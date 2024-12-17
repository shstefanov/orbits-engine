import React from "react"
import AbstractLightComponent from "./abstract/AbstractLightComponent"
import { SpotLight } from "three";

class OrbitsSpotLightComponent extends AbstractLightComponent {

	createElement(){
		return new SpotLight(
			this.props.color ?  parseInt(this.props.color.replace("#", "0x"), 16) : 0xffffff,
			this.props.intensity || 1,
			this.props.distance  || 10000,
			this.props.angle     || Math.PI / 8,
			this.props.penumbra  || 0.5,
			2
		);
	}

}

export default OrbitsSpotLightComponent