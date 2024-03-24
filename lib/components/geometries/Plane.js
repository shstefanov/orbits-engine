import Object3Component        from "../../Object3Component";
import { Mesh, PlaneGeometry } from "three";

export default class Plane extends Object3Component {

    createElement(){
      const { width, height, widthSegments, heightSegments } = this.props;
      this.geometry = new PlaneGeometry( width, height, widthSegments, heightSegments);
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}
