import React from "react"
import Object3Component from "../../Object3Component"

import {
  MeshPhongMaterial,
  Mesh,
  CircleGeometry
} from "three"

class Circle extends Object3Component {

    createElement(){
      // this.material = new MeshBasicMaterial({ color: this.props.color });


      this.material = new MeshPhongMaterial({
        color: this.props.color,
        // emissive: "#111111",
        reflectivity: 0.002,
        // map: (new TextureLoader()).load( texture ),
      });




      const { radius, segments } = this.props;
      this.geometry = new CircleGeometry( radius, segments );
      


      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}

export default Circle;
