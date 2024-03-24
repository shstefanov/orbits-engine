import Object3Component             from "../../Object3Component";
import { Mesh, OctahedronGeometry } from "three";

export default class Octahedron extends Object3Component {

    createElement(){
      const { radius, detail } = this.props;
      this.geometry = new OctahedronGeometry( radius, detail );
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}
