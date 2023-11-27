import React from "react"
import AbstractLightComponent from "./abstract/AbstractLightComponent"
import { PointLight, CameraHelper } from "three";

class OrbitsPointLightComponent extends AbstractLightComponent {

	createElement(){
		const element =  new PointLight(
			this.props.color ?  parseInt(this.props.color.replace("#", "0x"), 16) : 0xffffff,
			this.props.intensity || 10000, // Changed values in three@0.158.0
			this.props.distance  || 10000,
			2
		);

		if(this.props.debug){
			const helper = new CameraHelper( element.shadow.camera );
			element.add( helper );			
		}


		return element;
	}

}

export default OrbitsPointLightComponent