import React from "react";
import Object3Component from "../../Object3Component";

import {
  BufferGeometry, Points, PointsMaterial,
  Mesh, Vector3
} from "three";

class OrbitsPoints extends Object3Component {

    defaultMaterial(){
      return new PointsMaterial();
    }

    createElement(){
      this.geometry = new BufferGeometry();
      this.geometry.setFromPoints(this.props.points.map( c => new Vector3(...c)));
      const element = new Points( this.geometry, this.material );
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
      this.geometry.attributes.position.itemSize = 3;
      this.geometry.setDrawRange( 0, points.length );
      this.geometry.attributes.position.needsUpdate = true;
      this.geometry.computeBoundingBox();
      this.geometry.computeBoundingSphere();
    }

}

export default OrbitsPoints;
