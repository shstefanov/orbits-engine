import React from "react"
import LoadableComponent from "../abstract/LoadableComponent"

import {
  Sprite, SpriteMaterial,
} from "three"


class OrbitsSprite extends LoadableComponent {

  createElement(){
    return new Sprite(
      this.material,
    );
  }

}

export default OrbitsSprite;