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

      this.material = this.material || this.defaultMaterial();

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
