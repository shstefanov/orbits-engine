import React from "react";
import Object3Component from "../../Object3Component";

import {
  Line, LineBasicMaterial, LineDashedMaterial,
  Mesh, BufferGeometry, Vector3
} from "three";

const Prototypes = {
  LineBasicMaterial,
  LineDashedMaterial,
}

class OrbitsLine extends Object3Component {

    defaultMaterial(){
      const color = parseInt(((this.props.material || {}).color || "#aaaaaa").replace("#", "0x"), 16);
      return new LineBasicMaterial({color});
    }

    createElement(){
      const {points} = this.props;
      console.log("Engine.Line.points", points);
      this.geometry = new BufferGeometry();
      this.geometry.setFromPoints( points.map( p => new Vector3(...p) ) );
      this.handlePoints(points);
      const element =  new Line( this.geometry, this.material );
      element.computeLineDistances();
      return element;
    }

    UNSAFE_componentWillReceiveProps(nextProps){
      super.UNSAFE_componentWillReceiveProps(nextProps);
      nextProps.points && this.handlePoints(nextProps.points);
    }

    handlePoints(points){
      this.geometry.setFromPoints( points.map( p => new Vector3(...p) ) );
    }

}

export default OrbitsLine;
