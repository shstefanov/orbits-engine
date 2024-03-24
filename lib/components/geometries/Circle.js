import Object3Component         from "../../Object3Component";
import { Mesh, CircleGeometry } from "three";

export default class Circle extends Object3Component {

    createElement(){
      const { radius, segments } = this.props;
      this.geometry = new CircleGeometry( radius, segments );
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}
