// http://learningthreejs.com/blog/2012/01/17/dom-events-in-3d-space/
// https://threejs.org/docs/api/core/Raycaster.html
// https://github.com/jeromeetienne/threex.domevents
// http://stackoverflow.com/questions/14516425/subclass-three-mesh-using-prototypal-inheritance

//!!! http://stackoverflow.com/questions/16395690/curved-plane-surface-in-css3-or-three-js
//!!! http://jsfiddle.net/ebeit303/BuNb2/

const _           = require("underscore");

const Controller  = require("infrastructure/lib/client/Controller");

const THREE       = require("three");
const OrbitControls = require("three-orbit-controls")(THREE);

const initializeDomEvents = require('threex-domevents');
const THREEx = {};
initializeDomEvents(THREE, THREEx);

module.exports = Controller.extend("ViewportController", {

  init: function(options, cb){
    const app = require("app");
    this.container = document.querySelector(this.config.container);
    if(!this.container) return cb("Can't find DOM element " + this.config.container);
    this.data = _.result(this, "data") || {};
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
      this.renderer.setSize(
        this.viewport_dimmensions.width,
        this.viewport_dimmensions.height
      );
      this.camera.aspect = this.viewport_dimmensions.width / this.viewport_dimmensions.height;
      this.camera.updateProjectionMatrix();
    });

    const data = require("data");
    data.blocks.each(this.addObject.bind(this));
    data.blocks
      .on("reset", (blocks, data)=>{
        if(data.previousModels){
          data.previousModels.forEach((object)=>{ this.removeObject(object) });
        }
        blocks.forEach((block)=>this.addObject(block));
      }, this )
      .on("add", this.addObject, this)
      .on("remove", this.removeObject, this)
      .on("change:x change:y change:z", this.changeObjectPosition, this);

    cb();
  },

  setViewportDimmensions: function(){
    const container = this.container;
    let { width, height } = getComputedStyle(this.container);
    width  = parseInt(width  .replace("px", ""));
    height = parseInt(height .replace("px", ""));
    this.viewport_dimmensions = { width, height };
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

  blockMaterials: {
    "dirt":  new THREE.MeshLambertMaterial({color: 0xCC0000 }),
    "grass": new THREE.MeshLambertMaterial({color: 0x00CC00 }),
    "water": new THREE.MeshLambertMaterial({color: 0x0000CC }),
    "stone": new THREE.MeshLambertMaterial({color: 0xAAAAAA }),
  },

  cube_geometry: new THREE.CubeGeometry( 1,1,1 ),

  addObject: function(object){
    const type = object.get("type");
    const material = this.blockMaterials[type];
    const mesh = new THREE.Mesh(this.cube_geometry, material);
    const {x,y,z} = object.pick(["x", "y", "z"]);
    mesh.position.set(x,y,z);

    this.object_map.set(object, mesh);

    this.dom_events.addEventListener(mesh, 'mouseover', function(e){
      mesh.translateY(0.25);
    }, false );
    this.dom_events.addEventListener(mesh, 'mouseout', function(e){
      mesh.translateY(-0.25);
    }, false );
    this.scene.add(mesh);
  },

  removeObject: function(block){
    const mesh = this.object_map.get(block);
    if(mesh){
      this.scene.remove(mesh);
    }
  },

  changeObjectPosition: function(object){
    const mesh = this.object_map.get(object);
    if(mesh){
      const { x, y, z } = object.attributes;
      mesh.position.set(x,y,z);
    }
  }

});