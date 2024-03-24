import Object3Component                    from "../../Object3Component";
import { BufferGeometry, Points, Vector3 } from "three";

export default class OrbitsPoint extends Object3Component {

  createElement(){
      this.geometry = new BufferGeometry();
      this.geometry.setFromPoints([new Vector3( 0, 0, 0)]);
      const element =  new Points( this.geometry, this.material );
      return element;
    }

  }
