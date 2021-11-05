import React from "react"
import Object3Component from "../../Object3Component"

import {
  MeshPhongMaterial,
  MeshBasicMaterial,
  Mesh,
  LatheGeometry, Vector2
} from "three"

class Lathe extends Object3Component {

    createElement(){
      // this.material = new MeshBasicMaterial({ color: this.props.color });


      this.material = new MeshPhongMaterial({
        color: this.props.color,
        // emissive: "#111111",
        reflectivity: 0.002,
        // map: (new TextureLoader()).load( texture ),
      });

      const {
        shape,
        segments,
        phiStart,
        phiLength
      } = this.props;

      if(!shape) return null;

      const points = shape.map( ([x,y])=> new Vector2(x,y) );

      this.geometry = new LatheGeometry( points, segments, phiStart, phiLength );
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}

export default Lathe;
