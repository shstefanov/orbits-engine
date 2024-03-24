import Object3Component             from "../../Object3Component";
import { Mesh, PolyhedronGeometry } from "three";

export default class Polyhedron extends Object3Component {

    createElement(){
      const { vertices, indices, radius, detail } = this.props;
      this.geometry = new PolyhedronGeometry(vertices, indices, radius, detail);
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}
