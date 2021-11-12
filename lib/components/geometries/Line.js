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

    createMaterial(){
      let material;

      if(this.material) return this.material;

      if(!this.props.material) return this.material;
      if(typeof this.props.material === "string") return this.material;


      if(this.material) {
        // It can be loaded as material can be url string
        material = this.material
      }
      else {
        const { type, src, ...rest } = this.props.material;
        const Proto = Prototypes[this.props.material.type] || LineBasicMaterial;
        console.log("createMaterial()", this.material);
        return new Proto(rest);
      }
    }

    createElement(){
      const {points} = this.props;

      const vertices = points.map( p => new Vector3(...p) );

      this.geometry = new BufferGeometry().setFromPoints( vertices );
      this.material = this.createMaterial();

      this.handlePoints(points);

      return new Line( this.geometry, this.material );

      // this.geometry = new BoxGeometry( ...size_args );
      // const mesh = new Mesh( this.geometry, this.material );
      // return mesh;
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
