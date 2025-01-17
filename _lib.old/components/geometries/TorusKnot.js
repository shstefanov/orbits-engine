import React from "react"
import Object3Component from "../../Object3Component"

import {
  MeshPhongMaterial,
  MeshBasicMaterial,
  Mesh,
  TorusKnotGeometry
} from "three"

class TorusKnot extends Object3Component {

    createElement(){
      // this.material = new MeshBasicMaterial({ color: this.props.color });


      this.material = new MeshPhongMaterial({
        color: this.props.color,
        // emissive: "#111111",
        reflectivity: 0.002,
        // map: (new TextureLoader()).load( texture ),
      });


      const {
        radius,
        tube,
        tubularSegments,
        radialSegments,
        p,
        q,
      } = this.props;


      this.geometry = new TorusKnotGeometry(
        radius,
        tube,
        tubularSegments,
        radialSegments,
        p,
        q,
      );
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}

export default TorusKnot;
