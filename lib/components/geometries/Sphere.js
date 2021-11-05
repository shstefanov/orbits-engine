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
      // this.material = new MeshBasicMaterial({ color: this.props.color });


      this.material = new MeshPhongMaterial({
        color: this.props.color,
        // emissive: "#111111",
        reflectivity: 0.002,
        // map: (new TextureLoader()).load( texture ),
      });


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
