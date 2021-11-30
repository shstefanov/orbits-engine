import React, { Component, Fragment }   from "react";
import * as THREE                       from 'three';
import CameraControls                   from 'camera-controls';

import { InteractionManager }           from "./Interaction";
import {OrbitsSceneProvider}            from "./Object3Component";
import Timer                            from "@orbits/timer";

THREE.Cache.enabled = true

const { WebGLRenderer, Scene, PerspectiveCamera } = THREE;
CameraControls.install({THREE});


const canvasDefaultStyles = {
  width:  "100%",
  height: "100%",
  top:    "0px",
  left:   "0px",
  backgroundColor: "transparent",
  position: "fixed",
  zIndex:   "0",
};

const cameraDefaults = {
  fov:    35,
  aspect: window.innerWidth / window.innerHeight,
  near:   0.1,
  far:    25000000,
};

const rendererDefaults = {
    width:           window.innerWidth,
    height:          window.innerHeight,
    alpha:           true,
    autoclear:       false,
    clearColor:      0x000000,
    clearColorAlpha: 0.5,

    shadowMap: {
      enabled: true,
      type: THREE.PCFSoftShadowMap
    }
};

const cameraControlsDefaults = {
    enabled: true,

    // distance: 100,

    maxDistance: 4000,
    minDistance:  20, 
    // maxPolarAngle:  Math.PI * 0.6,
    // minPolarAngle: -Math.PI * 0.5,
    maxPolarAngle:  Math.PI,
    minPolarAngle: -Math.PI,
    
    maxAzimuthAngle: Infinity,
    minAzimuthAngle: -Infinity,
    
    boundaryFriction: 0,
    boundaryEnclosesCamera: false,
    
    dampingFactor: 20,

    // distance: 10,
    
    draggingDampingFactor: 10,
    
    azimuthRotateSpeed: 1,
    polarRotateSpeed: 1,

    dollySpeed: 0.2,
    truckSpeed: 2.0,

    verticalDragToForward: false,

    dollyToCursor: true,

    /*
        CameraControls.ACTION.ROTATE* 
        CameraControls.ACTION.TRUCK 
        CameraControls.ACTION.DOLLY 
        CameraControls.ACTION.ZOOM 
        CameraControls.ACTION.NONE
    */
    mouseButtons: {
        left: CameraControls.ACTION.ROTATE,
        middle: CameraControls.ACTION.NONE,
        right: CameraControls.ACTION.TRUCK,
        wheel: CameraControls.ACTION.DOLLY
    },

    touches: {
        one:   CameraControls.ACTION.ROTATE,
        two:   CameraControls.ACTION.DOLLY,
        three: CameraControls.ACTION.NONE,
    }

}

function defaults(object, defaultProps){
  const o = {...object};
  let changed = false;
  for(let prop_name in defaultProps){
    if(!o.hasOwnProperty(prop_name)){
      changed = true;
      o[prop_name] = defaultProps[prop_name];
    }
  }
  return changed ? o : object;
}

export default class OrbitsScene extends Component {
  
  constructor(props){
    super(props);
    this.state = {};
    this._binds = {};
    this.orbitsContext = {
      defer: (fn) => {
        if(!this.orbitsContext._defers) {
          this.orbitsContext._defers = [];
          setTimeout(() => {
            for(let fn of this.orbitsContext._defers) fn();
            delete this.orbitsContext._defers;
          }, 0);
        }
        this.orbitsContext._defers.push(fn);
      }
    };
    window.orbitsContext = this.orbitsContext;
  }

  setCanvas(canvas){
    if(this.orbitsContext.canvas) return;

    const defaultCursor = this.props.defaultCursor || "auto";

    canvas.style.cursor=defaultCursor

    this.orbitsContext.setCursor = ( cursor ) => {
      cursor = cursor || defaultCursor;
      canvas.style.cursor = cursor.match(/[\/.]/)
        ? `url('${cursor || defaultCursor}'), auto`
        : cursor;
    }

    this.orbitsContext.setCursor(defaultCursor);

    
    this.orbitsContext.canvas         = canvas;
    this.orbitsContext.scene          = this.createScene(this.props);
    this.orbitsContext.overlay        = this.createOverlay(this.props);
    this.orbitsContext.timer          = this.createTimer(this.props);
    this.orbitsContext.camera         = this.createCamera(this.props);
    this.orbitsContext.audioListener  = this.createaudioListener(this.props);
    this.orbitsContext.fontsCache     = this.createFontsCache(this.props);
    this.orbitsContext.materialsCache = this.createMaterialsCache(this.props);
    this.orbitsContext.renderer       = this.createRenderer(this.props);
    this.orbitsContext.controls       = this.createControls(this.props);
    this.orbitsContext.interaction    = this.createInteraction(this.props);

    let width, height, debounce;
    window.addEventListener("resize", this.initOnResizeListener = e => {
      width  = window.innerWidth;
      height =  window.innerHeight;
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        this.orbitsContext.camera.aspect = width / height;
        this.orbitsContext.camera.updateProjectionMatrix();
        this.orbitsContext.renderer.setSize( width, height );
        debounce = false;
      }, 40);
    });

    this.setState({...this.orbitsContext});
  }

  render(){
    const { canvas } = this.state;
    return React.createElement(Fragment, {},
      // The canvas
      React.createElement('canvas', {
        style: this.props.style || canvasDefaultStyles,
        ref:   canvas => this.setCanvas(canvas)
      }),
      
      // Scene Provider
      canvas && React.createElement(OrbitsSceneProvider,
        { value: this.orbitsContext },
        this.props.children
      ),
    );
  }

  createScene(props){
    const scene = new Scene();
    this.props.position && Object.assign(scene.position, this.props.position);
    this.props.rotation && Object.assign(scene.rotation, this.props.rotation);
    this.props.scale    && 
      typeof this.props.scale === "number"
        ? Object.assign(scene.scale, {x: this.props.scale, y: this.props.scale, z: this.props.scale })
        : Object.assign(scene.scale, this.props.scale)
    return scene;
  }

  createOverlay(props){
    return new Scene();
  }

  createTimer(props){
    const timer = this.props.timer || new Timer({ speed: 0 });
    console.warn("TODO: Think about autostarting the timer!!!");
    this.orbitsContext.nestedTimers = new Set();
    timer.interval(this.props.renderInterval || 40, params => {
      for(let [t] of this.orbitsContext.nestedTimers.entries()) {
        const state = t.getState(params.now);
        // console.log({state});
        t.handleState(state);
        t.state = state;
      }
      this.updateRenderer(params);
      // this.orbitsContext.controls && this.orbitsContext.controls.update(params.delta);
    });


    timer.start(this.props.renderInterval || 40);
    return timer;
  }

  createCamera(props){
    const options = props.cameraOptions || cameraDefaults;
    const camera = new PerspectiveCamera(
      options.fov,
      options.aspect,
      options.near,
      options.far
    );
    return camera;
  }

  createMaterialsCache(){
    return new Map();
  }

  createFontsCache(props){
    return new Map();
  }

  createaudioListener(){
    const listener = new THREE.AudioListener();
    this.orbitsContext.camera.add(listener);
    this.orbitsContext.audioCache = new Map();
    return listener;
  }

  createRenderer(props){
    const { canvas } = this.orbitsContext;
    const { shadowMap, ...options } = props.rendererOptions || rendererDefaults;
    const renderer = new WebGLRenderer({
      canvas,
      alpha: options.alpha,
    });
    renderer.setSize( options.width, options.height );
    renderer.autoClear = options.autoclear;
    renderer.setClearColor(options.clearColor, options.clearColorAlpha);
    if(shadowMap){
      Object.assign(renderer.shadowMap, shadowMap);
      renderer.shadowMap.needsUpdate = true;
    }
    return renderer;
  }

  createControls(props){
    const { camera, canvas, timer } = this.orbitsContext;
    const controls = new CameraControls( camera, canvas );
    Object.assign(controls, defaults((this.props.cameraControls || {}), cameraControlsDefaults));
    this._binds.onControlsUpdateListener = e => {
      this.props.onUpdateControls && this.props.onUpdateControls(e);
    }
    controls.addEventListener( "update", this._binds.onControlsUpdateListener);
    this.orbitsContext.setCameraControls = this.setCameraControlsOptions.bind(this);

    controls.update();
    return controls;
  }

  setCameraControlsOptions(opts){
      const combined = defaults(
        opts || {},
        defaults(this.props.cameraControls, cameraControlsDefaults)
      );
      const {zoom, target, ...rest} = combined;
      rest.distance = Math.max( rest.distance || 0, rest.minDistance );
      rest.distance = Math.min( rest.distance || cameraControlsDefaults.maxDistance, rest.maxDistance );
      Array.isArray(target) && this.orbitsContext.controls.setTarget(...target);
      (typeof zoom === "number") && this.orbitsContext.controls.zoomTo(zoom);
      Object.assign(this.orbitsContext.controls, rest);
      this.orbitsContext.controls.update(0);
  }

  createInteraction(props){
    const { renderer, camera, canvas, overlay } = this.orbitsContext;
    const interaction = new InteractionManager(renderer, camera, canvas);
    return interaction;
  }




  updateRenderer(params){
    const {
      renderer, scene, overlay, camera, interaction, controls
    } = this.orbitsContext;

    if(!renderer) return;

    for(let layer of [ scene, overlay ]){
      renderer.clearDepth();
      renderer.render( layer, camera );
    }

    controls._needsUpdate && controls.update(params.delta);
    interaction.update();
  }



  componentWillUnmount(){
    window.removeEventListener("resize", this.initOnResizeListener);
    this.orbitsContext.interactions.dispose();
    this.orbitsContext.controls.dispose();
    this.orbitsContext.timer.stop();
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    // TODO - handle changes
  }

}





function __ThreeScene ({

  dispatch, timer_state,

  rendererOptions, screen,

  cameraSettings,

  initOnResizeListener,

  layers, interactionLayer, defaultLayer,

  children
}){

  const timer = timer_actions(dispatch, timer_state);

  const [canvas, setCanvas ] = useState(null);
  const [camera, setCamera ] = useState(null);
  const [SceneProvider, setSceneProvider ] = useState(null);
  const [sceneMap, setSceneMap ] = useState(null);

  useEffect(() => {  if(!canvas) return;

    const scenes = [], sceneMap = {};

    for(let layer_name of layers){
      const scene = new Scene();
      scene.name = layer_name;
      scenes.push(scene);
      sceneMap[layer_name] = scene;
    }

    const camera = new PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 2500000 );
    const renderer = new WebGLRenderer({canvas, alpha: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;
    renderer.setClearColor(0xffff00, 0.5);

    const interaction = new InteractionManager(
      renderer,
      camera,
      renderer.domElement
    );

    const interactionScene = sceneMap[interactionLayer];

    interactionScene.addWrapper    = interactionScene.add;
    interactionScene.removeWrapper = interactionScene.remove;

    interactionScene.add = (...args) => {
      interactionScene.addWrapper(...args);
      interaction.add(...args);
    }

    interactionScene.remove = (...args) => {
      interactionScene.removeWrapper(...args);
      interaction.remove(...args);
    }

    let cursor = "inherit", last_known_cursor = "inherit";
    interactionScene.setCursor = _cursor => {
      cursor = _cursor || "inherit";
    };

    let updateInterval
    timer.timeInterval({ interval: 0 }, updateInterval = (params, phase) => {

      if(cursor !== last_known_cursor){
        // Apply new cursor here
        switch(typeof cursor){
          case "number":
          case "string": {
            last_known_cursor = cursor;
            canvas.style.cursor = cursor;
            break;
          }
        }


        last_known_cursor = cursor;

      }
      for(let scene of scenes){
        renderer.clearDepth();
        renderer.render( scene, camera );
        interaction.update();  // First interaction, it may have some hover effects to apply
        // renderer.autoClear = false;
      }
    });

    let initOnResizeListener;
    window.addEventListener("resize", initOnResizeListener = e => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    });

    setSceneProvider(Provider);
    setSceneMap(sceneMap);
    setSceneProvider(Provider);
    setCamera(camera);

    return () => {
      timer.removeTimeInterval(updateInterval);
      interaction.dispose();
      // canvas.outerHTML = canvas.outerHTML; // Removes all listeners ?
      window.removeEventListener("resize", initOnResizeListener);
    }
  }, [canvas]);

  return React.createComponent(Fragment, {}, [
    React.createComponent(SceneCanvas, {ref: setCanvas}),
    camera && React.createComponent(OrbitControls, {canvas, timer}),
    SceneProvider && React.createComponent(SceneProvider, {value: sceneMap }, children),
  ]);

  // return <Fragment>
  //   <SceneCanvas ref={ setCanvas } />
  //   { camera && <OrbitControls canvas={canvas} camera={camera} timer={timer} />}
  //   { SceneProvider && <SceneProvider value={sceneMap}>{children}</SceneProvider> }
  // </Fragment>;
}