import Object3Component              from "../../Object3Component";
import { Mesh, IcosahedronGeometry } from "three";

export default class Icosahedron extends Object3Component {

    createElement(){
      const { radius, detail } = this.props;
      this.geometry = new IcosahedronGeometry( radius, detail );
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}
