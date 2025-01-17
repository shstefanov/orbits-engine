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
      const vertices = points.map( p => new Vector3(...p) );
      this.geometry = new BufferGeometry().setFromPoints( vertices );
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
      const buffer = new Float32Array(points.length * 3);
      const verts = points.reduce( (a, p) => a.concat(p), []);
      verts.forEach( (n, i) => { buffer[i] = n });
      this.geometry.attributes.position.array = buffer;
      this.geometry.attributes.position.itemSize = points.length;
      this.geometry.setDrawRange( 0, points.length );
      this.geometry.attributes.position.needsUpdate = true;
      this.geometry.computeBoundingBox();
      this.geometry.computeBoundingSphere();
    }

}

export default OrbitsLine;
