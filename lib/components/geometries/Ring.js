import React from "react"
import Object3Component from "../../Object3Component"

import {
  MeshPhongMaterial,
  MeshBasicMaterial,
  Mesh,
  RingGeometry
} from "three"

class Ring extends Object3Component {

    createElement(){
      // this.material = new MeshBasicMaterial({ color: this.props.color });


      this.material = new MeshPhongMaterial({
        color: this.props.color,
        // emissive: "#111111",
        reflectivity: 0.002,
        // map: (new TextureLoader()).load( texture ),
      });


      const {
        innerRadius,
        outerRadius,
        thetaSegments,
        phiSegments,
        thetaStart,
        thetaLength,
      } = this.props;


      this.geometry = new RingGeometry(
        innerRadius,
        outerRadius,
        thetaSegments,
        phiSegments,
        thetaStart,
        thetaLength
      );
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}

export default Ring;
