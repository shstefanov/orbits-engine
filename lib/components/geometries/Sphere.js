import React from "react"
import Object3Component from "../../Object3Component"

import {
  MeshPhongMaterial,
  MeshBasicMaterial,
  Mesh,
  SphereGeometry
} from "three"

class Sphere extends Object3Component {

    createElement(){

      const {
        radius, widthSegments, heightSegments,
        phiStart, phiLength, thetaStart, thetaLength
      } = this.props;


      this.geometry = new SphereGeometry(
        radius, widthSegments, heightSegments,
        phiStart, phiLength, thetaStart, thetaLength
      );
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}

export default Sphere;
