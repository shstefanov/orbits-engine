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
        geometryExtrudePath = new CatmullRomCurve3(path.map( point => new Vector3(...(point.map(a => parseFloat(a))))));
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


    UNSAFE_componentWillReceiveProps(nextProps){
      super.UNSAFE_componentWillReceiveProps(nextProps);
      nextProps.path !== this.path && this.handlePath(nextProps.path);
    }

    handlePath(path){
      this.geometry.extrudePath = new CatmullRomCurve3(path.map( point => new Vector3(...point)));
      this.path = path;
    }

}

export default Extrude;
