var Controller  = require("infrastructure/lib/client/Controller");

const THREE = require("three");

module.exports = Controller.extend("MapViewportController", {
  initOrder: 0,
  config: "viewport",
  init: function(options, cb){
    const app = require("app");
    this.container = document.querySelector(this.config.container);
    if(!this.container) return cb("Can't find DOM element " + this.config.container);
    this.setViewportDimmensions();
    this.setCameraOptions();
    this.createRenderer();
    this.createCamera();
    this.createCameraLight();
    this.createScene();
    this.container.appendChild(this.renderer.domElement);

    const render = ()=>{
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(render);
    }
    render();
    cb();
  },

  setViewportDimmensions: function(){
    const container = this.container;
    let { width, height } = getComputedStyle(this.container);
    width  = parseInt(width  .replace("px", "")) - 8;
    height = parseInt(height .replace("px", "")) - 8;
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
  createCameraLight: function(){
    this.camera.add(new THREE.PointLight(this.config.camera_light))
  },

  createRenderer: function(){
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(
      this.viewport_dimmensions.width,
      this.viewport_dimmensions.height
    );
  },

  createScene: function(){
    this.scene = new THREE.Scene();
    this.scene.add(this.camera);
  }
});