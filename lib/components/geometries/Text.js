import React from "react"
import LoadableComponent from "../abstract/LoadableComponent"

import {
  MeshPhongMaterial,
  MeshBasicMaterial,
  Mesh,
  FontLoader, TextGeometry

} from "three"


class Text extends LoadableComponent {

  createElement(){
    const font = this.__font;

    const {
      text,
      size,
      
      height,
      curveSegments,
      bevelEnabled,
      bevelThickness,
      bevelSize,
      bevelOffset,
      bevelSegments,
    } = this.props;


    this.geometry = new TextGeometry( text, {
      font,
      size,
      height,
      curveSegments,
      bevelEnabled,
      bevelThickness,
      bevelSize,
      bevelOffset,
      bevelSegments,
    });

    return new Mesh(
      this.geometry,
      this.material || this.defaultMaterial(),
    );
  }

  async loadElement(){

    await super.loadElement();

    const cache = this.context.fontsCache;
    const src = this.props.font;

    const done = (font) => {
      this.mountElement();
      this.mountInteraction();
      this.UNSAFE_componentWillReceiveProps(this.props);
      this.setState({__isLoaded: true});
    }

    if(cache.has(src)) {
      this.__font = cache.get(src);
      return done();
    }

    const loader = new FontLoader();

    loader.load( src, ( font ) => {
      cache.set(src, font);
      this.__font = font;
      done();
    })

  }

}

export default Text;