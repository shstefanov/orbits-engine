import Object3Component               from "../../Object3Component";
import { Mesh, DodecahedronGeometry } from "three";

export default class Dodecahedron extends Object3Component {

    createElement(){
      const { radius, detail } = this.props;
      this.geometry = new DodecahedronGeometry( radius, detail );
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}
