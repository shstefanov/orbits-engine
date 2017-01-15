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
    this.test();


    cb();
  },

  setViewportDimmensions: function(){
    const container = this.container;
    let { width, height } = getComputedStyle(this.container);
    width  = parseInt(width  .replace("px", "")) - 4;
    height = parseInt(height .replace("px", "")) - 4;
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
  test: function(){

    // create the sphere's material
    const material = new THREE.MeshLambertMaterial({
      color: 0xCC0000
    });

    // Set up the sphere vars
    const RADIUS = 50;
    const SEGMENTS = 16;
    const RINGS = 16;

    // Create a new mesh with
    // sphere geometry - we will cover
    // the sphereMaterial next!
    const sphere = new THREE.Mesh(

      // new THREE.SphereGeometry(
      //   RADIUS,
      //   SEGMENTS,
      //   RINGS),

      new THREE.CubeGeometry( 1,1,1 ),

      material);

    // Move the Sphere back in Z so we
    // can see it.
    // sphere.position.z = -300;

    // Finally, add the sphere to the scene.
    this.scene.add(sphere);

    // // create a point light
    // const pointLight = new THREE.PointLight(0xFFFFFF);

    // // set its position
    // pointLight.position.x = 10;
    // pointLight.position.y = 50;
    // pointLight.position.z = 130;

    // // add to the scene
    // scene.add(pointLight);


  }


});