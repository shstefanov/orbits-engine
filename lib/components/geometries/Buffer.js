import React from "react";
import Object3Component from "../../Object3Component";

import {
  BufferGeometry, Points, PointsMaterial,
  Mesh, Vector3, MeshPhongMaterial
} from "three";

class BufferComponent extends Object3Component {

    defaultMaterial(){
      return new MeshPhongMaterial({});
    }

    createElement(){
      this.geometry = new BufferGeometry();
      this.geometry.setFromPoints(this.props.points.map( c => new Vector3(...c)));
      const element = new Mesh( this.geometry, this.material );
      return element;
    }

    UNSAFE_componentWillReceiveProps(nextProps){
      super.UNSAFE_componentWillReceiveProps(nextProps);
      nextProps.points && this.handlePoints(nextProps.points);
    }

    handlePoints(points){
      if(points === this.points) return;
      this.geometry.setFromPoints(this.props.points.map( c => new Vector3(...c)));
      this.points = points;
    }

}

export default BufferComponent;
