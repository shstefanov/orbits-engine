import React from "react"
import Object3Component from "../../Object3Component"

import {
  MeshPhongMaterial,
  MeshBasicMaterial,
  Mesh,
  BoxGeometry
} from "three"

class Box extends Object3Component {

    createElement(){
      // this.material = new MeshBasicMaterial({ color: this.props.color });


      this.material = new MeshPhongMaterial({
        color: this.props.color,
        // emissive: "#111111",
        reflectivity: 0.002,
        // map: (new TextureLoader()).load( texture ),
      });




      const size_args = this.props.size 
        ? typeof this.props.size === "number"
          ? [this.props.size, this.props.size, this.props.size]
          : this.props.size
        : [1, 1, 1]
      this.geometry = new BoxGeometry( ...size_args );
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}

export default Box;
