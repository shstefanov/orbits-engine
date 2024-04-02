import Object3Component                  from "../../Object3Component";
import { Line, BufferGeometry, Vector3 } from "three";

export default class OrbitsLine extends Object3Component {

    createElement(){
      const {points} = this.props;
      this.geometry = new BufferGeometry();
      this.handlePoints(points);
      const element =  new Line( this.geometry, this.material );
      element.computeLineDistances();
      return element;
    }

    UNSAFE_componentWillReceiveProps(nextProps){
      super.UNSAFE_componentWillReceiveProps(nextProps);
      nextProps.points && this.handlePoints(nextProps.points);
    }

    handlePoints(points){
      if(points === this.points || !this.geometry) return;
      this.geometry.setFromPoints( points.map( p => new Vector3(...p) ) );
      this.points = points;
    }

}
