// http://learningthreejs.com/blog/2012/01/17/dom-events-in-3d-space/
// https://threejs.org/docs/api/core/Raycaster.html
// https://github.com/jeromeetienne/threex.domevents
// http://stackoverflow.com/questions/14516425/subclass-three-mesh-using-prototypal-inheritance

//!!! http://stackoverflow.com/questions/16395690/curved-plane-surface-in-css3-or-three-js
//!!! http://jsfiddle.net/ebeit303/BuNb2/

const _             = require("underscore");

const Controller    = require("infrastructure/lib/client/Controller");

const THREE         = require("three");
const OrbitControls = require("three-orbit-controls")(THREE);

const initializeDomEvents = require('threex-domevents');
const THREEx = {};
initializeDomEvents(THREE, THREEx);

var stop_traverse = ["undefined", "string", "number", "function", "boolean"];
function traverse(obj, iterator, path, refs){
  path = path || [];
  refs = refs || new WeakSet();
  if(obj === null || stop_traverse.indexOf(typeof obj) > -1 ) return iterator(obj, path);;
  if(refs.has(obj)) return;
  refs.add(obj);
  iterator(obj, path);
  if(obj[Symbol.iterator]){
    for(let i = 0; i< obj.length; i++){
      traverse(obj[i], iterator, path.concat([i]), refs);
    }
  }
  else{
    for(var k in obj){
      traverse(obj[k], iterator, path.concat([k]), refs);
    }
  }
}


module.exports = Controller.extend("ThreejsViewportController", {

  THREE: THREE,

  init: function(options, cb){
    const app = require("app");
    this.container = document.querySelector(this.config.container);
    if(!this.container) return cb("Can't find DOM element " + this.config.container);
    this.data      = _.result(this, "data")      || {};
    this.resources = _.result(this, "resources") || {};
    this.setViewportDimmensions();
    this.setCameraOptions();
    this.createRenderer();
    this.createCamera();
    this.createCameraLight();
    this.createScene();
    this.createDomEvents();
    this.createObjectMap();
    this.container.appendChild(this.renderer.domElement);

    this.abs_time_anchor = this.tmp_time_anchor = Date.now();
    const render = ()=>{
      const now = Date.now();
      const abs_diff = now - this.abs_time_anchor;
      const tmp_diff = now - this.tmp_time_anchor;
      this.tmp_time_anchor = now;
      this.trigger("tick", { abs_diff, tmp_diff });
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(render);
    }
    render();

    window.addEventListener('resize', ()=> {
      this.setViewportDimmensions();
    });

    cb();
     
  },

  updateViewportSize: function(){
    setTimeout(()=>{ this.setViewportDimmensions(); }, 0);
  },

  setViewportDimmensions: function(){
    const container = this.container;
    let { width, height } = getComputedStyle(this.container);
    width  = parseInt(width  .replace("px", ""));
    height = parseInt(height .replace("px", ""));
    this.viewport_dimmensions = { width, height };

    this.container.width  = width;
    this.container.height = height;

    if(this.renderer) {
      this.renderer.setSize(
        this.viewport_dimmensions.width,
        this.viewport_dimmensions.height
      );
    }
    if(this.camera){
      this.camera.aspect = this.viewport_dimmensions.width / this.viewport_dimmensions.height;
      this.camera.updateProjectionMatrix();      
    }
  },

  setCameraOptions: function(){
    this.camera_options = {
      view_angle: this.config.view_angle || 45,
      aspect:     this.viewport_dimmensions.width / this.viewport_dimmensions.height,
      near:       this.config.near       || 0.1,
      far:        this.config.far        || 1000,
    };
  },

  createCamera: function(){
    this.camera = new THREE.PerspectiveCamera(
      this.camera_options.view_angle,
      this.camera_options.aspect,
      this.camera_options.near,
      this.camera_options.far
    );

    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 10;

    this.orbit_controls = new OrbitControls(this.camera, this.container);

    this.orbit_controls.minPolarAngle = this.config.min_polar_angle || 0;
    this.orbit_controls.maxPolarAngle = this.config.max_polar_angle || Math.PI;

    this.orbit_controls.minDistance = this.config.min_distance || 10;
    this.orbit_controls.maxDistance = this.config.max_distance || 30;
    setTimeout(()=>this.orbit_controls.reset(), 0);
  },

  createCameraLight: function(){
    this.camera.add(new THREE.PointLight(this.config.camera_light))
  },

  createRenderer: function(){
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(
      this.viewport_dimmensions.width,
      this.viewport_dimmensions.height
    );
    this.renderer.setClearColor(this.config.clear_color_hex || 0xffffff);
    this.renderer.setClearAlpha(this.config.clear_color_opacity || 1);
  },

  createScene: function(){
    this.scene = new THREE.Scene();
    this.scene.add(this.camera);
    this.camera.lookAt(this.scene);
  },

  createDomEvents: function(){
    this.dom_events = new THREEx.DomEvents(this.camera, this.renderer.domElement);
  },

  createObjectMap: function(){
    this.object_map = new WeakMap();
  },

  },




});