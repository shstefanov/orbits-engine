import Object3Component       from "../../Object3Component";
import { Mesh, RingGeometry } from "three";

export default class Ring extends Object3Component {

    createElement(){
      this.geometry = new RingGeometry(
        this.props.innerRadius,
        this.props.outerRadius,
        this.props.thetaSegments,
        this.props.phiSegments,
        this.props.thetaStart,
        this.props.thetaLength
      );
      const mesh = new Mesh( this.geometry, this.material );
      return mesh;
    }

}
