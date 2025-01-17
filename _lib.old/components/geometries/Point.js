import React from "react";
import Object3Component from "../../Object3Component";

import {
  BufferGeometry, Points, PointsMaterial,
  Mesh, Vector3
} from "three";

class OrbitsPoint extends Object3Component {

    defaultMaterial(){
      return new PointsMaterial({color});
    }

    createElement(){
      this.geometry = new BufferGeometry();
      this.geometry.setFromPoints([new Vector3( 0, 0, 0)]);
      const element =  new Points( this.geometry, this.material );
      return element;
    }

}

export default OrbitsPoint;
