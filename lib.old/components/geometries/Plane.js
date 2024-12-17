import React from "react"
import Object3Component from "../../Object3Component"

import {
  MeshPhongMaterial,
  MeshBasicMaterial,
  Mesh,
  PlaneGeometry
} from "three"

class Plane extends Object3Component {

    createElement(){
      // this.material = new MeshBasicMaterial({ color: this.props.color });


      this.material = new MeshPhongMaterial({
        color: this.props.color,
        // emissive: "#111111",
        reflectivity: 0.002,
        // map: (new TextureLoader()).load( texture ),
      });

      const {width, height, widthSegments, heightSegments} = this.props;


      this.geometry = new PlaneGeometry( width, height, widthSegments, heightSegments);
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}

export default Plane;
