import React from "react"
import Object3Component from "../../Object3Component"

import {
  MeshPhongMaterial,
  MeshBasicMaterial,
  Mesh,
  ShapeGeometry, Shape
} from "three"

class ShapeComponent extends Object3Component {

    createElement(){
      // this.material = new MeshBasicMaterial({ color: this.props.color });


      this.material = new MeshPhongMaterial({
        color: this.props.color,
        // emissive: "#111111",
        reflectivity: 0.002,
        // map: (new TextureLoader()).load( texture ),
      });


      const {shape, curveSegments} = this.props;

      const geometryShape = new Shape();
      for(let [ type, ...params] of shape){
        geometryShape[type + "To"](...params);
      }

      this.geometry = new ShapeGeometry(geometryShape, curveSegments);
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}

export default ShapeComponent;
