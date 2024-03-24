import Object3Component           from "../../Object3Component";
import { Mesh, CylinderGeometry } from "three";

export default class Cylinder extends Object3Component {

    createElement(){
      const { radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength } = this.props;
      this.geometry = new CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}
