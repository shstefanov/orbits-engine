import Object3Component       from "../../Object3Component";
import { Mesh, ConeGeometry } from "three";

export default class Cone extends Object3Component {

    createElement(){
      const { radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength} = this.props;
      this.geometry = new ConeGeometry(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}
