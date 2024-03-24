import Object3Component                 from "../../Object3Component";
import { Mesh, LatheGeometry, Vector2 } from "three";

export default class Lathe extends Object3Component {

    createElement(){
      const { shape, segments, phiStart, phiLength } = this.props;
      if(!shape) return null;
      const points = shape.map( ([x,y])=> new Vector2(x,y) );
      this.geometry = new LatheGeometry( points, segments, phiStart, phiLength );
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}
