import Object3Component                    from "../../Object3Component";
import { BufferGeometry, Points, Vector3 } from "three";

export default class OrbitsPoints extends Object3Component {

    createElement(){
      this.geometry = new BufferGeometry();
      this.handlePoints(this.props.points);
      const element = new Points( this.geometry, this.material );
      return element;
    }

    UNSAFE_componentWillReceiveProps(nextProps){
      super.UNSAFE_componentWillReceiveProps(nextProps);
      nextProps.points && this.handlePoints(nextProps.points);
    }

    handlePoints(points){
      if(points === this.points) return;
      this.geometry.setFromPoints(this.props.points.map( c => new Vector3(...c)));
      this.points = points;
    }

}
