import React from "react"
import Object3Component from "../Object3Component"
import { Mesh, TextureLoader } from "three";
import OBJLoader from "./abstract/OBJLoader";

class ObjLoader extends Object3Component {

    createElement(cb, progress){


      Promise.all([
        
        new Promise( (resolve, reject) => {
          (new OBJLoader()).load(
            this.props.src,      // the source url
            obj => resolve(obj), 
            xhr => {},           //progress && progress(xhr.loaded / xhr.total * 100), // progress handler
            err => reject(err)   // error handler
          )
        }),

        // Load textures
        new Promise( (resolve, reject) => {
          if(!this.props.textures) return resolve(null);
          const result = {}
          for(let el_name in this.props.textures){
            const src = this.props.textures[el_name];
            result[el_name] = (new TextureLoader()).load(src);
          }
          resolve(result);
        }),

        // Load normalMaps
        new Promise( (resolve, reject) => {
          if(!this.props.normalMaps) return resolve(null);

          if(!this.props.normalMaps) return resolve(null);
          const result = {}
          for(let el_name in this.props.normalMaps){
            const src = this.props.normalMaps[el_name];
            result[el_name] = (new TextureLoader()).load(src);
          }
          resolve(result);

        }),


      ]).then( ([element, textures, normalMaps]) => {
        cb(null, { element, textures, normalMaps });
      })
      .catch(cb)




    }

    mountElement(){
      this.createElement( (err, { element, textures, normalMaps } = {}) => {

        if(err) return this.props.onError && this.props.onError(err);

        this.element = element;

        if(this.props.id) element.name = this.props.id;
        const scene = this.props.overlay ? this.context.overlay : this.context.scene;

        if(textures){
          for(let el_name in textures){
            this.element.traverse( child => {
              if(child.name === el_name){
                child.material.map = textures[el_name];
                child.material.needsUpdate = true;
              }
            });            
          }
        }

        if(normalMaps){
          for(let el_name in normalMaps){
            this.element.traverse( child => {
              if(child.name === el_name){
                child.material.normalMap = normalMaps[el_name];
                child.material.needsUpdate = true;
              }
            });            
          }
        }

        scene.add(element);
        this.UNSAFE_componentWillReceiveProps(this.props);
      }, progress => this.props.onProgress && this.props.onProgress(progress));
    }

    handleColor(color){
      if(this.element && this.props.applyColor && (typeof color === "string")){
        this.element.traverse( child => {
          if(child instanceof Mesh && child.name === this.props.applyColor){
            child.material.color.setHex( parseInt(color.replace("#", "0x"), 16) );
          }
        });
      }
    }

}

export default ObjLoader;
