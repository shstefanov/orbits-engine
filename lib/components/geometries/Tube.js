import React from "react"
import Object3Component from "../../Object3Component"

import {
  MeshPhongMaterial,
  MeshBasicMaterial,
  Mesh,
  TubeGeometry, Vector3, CatmullRomCurve3
} from "three"

class Tube extends Object3Component {

    createElement(){
      // this.material = new MeshBasicMaterial({ color: this.props.color });


      this.material = new MeshPhongMaterial({
        color: this.props.color,
        // emissive: "#111111",
        reflectivity: 0.002,
        // map: (new TextureLoader()).load( texture ),
      });

      const { path, tubularSegments, radius, radialSegments, closed } = this.props;
      const points = path.map( point => new Vector3(...(point.map(a => parseFloat(a)))));
      const curve = new CatmullRomCurve3(points);
      curve.curveType = "catmullrom";
      curve.closed = !!closed

      this.geometry = new TubeGeometry(
        curve,
        tubularSegments, radius, radialSegments, closed
      );

      console.log("GEOMETRY: ", this.geometry);

      // this.geometry.computeBoundingBox();
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}

export default Tube;
