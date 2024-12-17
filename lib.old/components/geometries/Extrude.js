import React from "react"
import Object3Component from "../../Object3Component"

import {
  MeshPhongMaterial,
  MeshBasicMaterial,
  Mesh,
  ExtrudeGeometry,
  Shape,
  Vector3, CatmullRomCurve3,
} from "three"

class Extrude extends Object3Component {

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

        closed,
        path,

        steps,
        depth,
        bevelEnabled,
        bevelThickness,
        bevelSize,
        bevelOffset,
        bevelSegments,
      } = this.props;

      if(!shape) return null;


      const geometryShape = new Shape();

      let geometryExtrudePath = null;

      for(let [ type, ...params] of shape){
        geometryShape[type + "To"](...params);
      }

      if(path){
        const points = path.map( point => new Vector3(...(point.map(a => parseFloat(a)))));
        geometryExtrudePath = new CatmullRomCurve3(points);
        geometryExtrudePath.curveType = "catmullrom";
        geometryExtrudePath.closed = !!closed;
      }

      this.geometry = new ExtrudeGeometry( geometryShape, {
        steps,
        depth,
        bevelEnabled,
        bevelThickness,
        bevelSize,
        bevelOffset,
        bevelSegments,
        extrudePath: geometryExtrudePath
      });
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}

export default Extrude;
