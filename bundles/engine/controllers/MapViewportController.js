// http://learningthreejs.com/blog/2012/01/17/dom-events-in-3d-space/
// https://threejs.org/docs/api/core/Raycaster.html
// https://github.com/jeromeetienne/threex.domevents
// http://stackoverflow.com/questions/14516425/subclass-three-mesh-using-prototypal-inheritance

var Controller  = require("infrastructure/lib/client/Controller");

const THREE       = require("three");
var OrbitControls = require("three-orbit-controls")(THREE);

module.exports = Controller.extend("MapViewportController", {
  initOrder: 2,
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
    data.blocks.each(this.addBlock.bind(this));
    data.blocks
      .on("reset", (blocks)=>{ blocks.forEach((block)=>this.addBlock(block)) })
      .on("add", this.addBlock, this)
      .on("remove", this.removeBlock, this);

    this.test();

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

  blockMaterials: {
    "dirt":  new THREE.MeshLambertMaterial({color: 0xCC0000 }),
    "grass": new THREE.MeshLambertMaterial({color: 0x00CC00 }),
    "water": new THREE.MeshLambertMaterial({color: 0x0000CC }),
    "stone": new THREE.MeshLambertMaterial({color: 0xAAAAAA }),
  },

  cube_geometry: new THREE.CubeGeometry( 1,1,1 ),

  addBlock: function(block){
    console.log("addBlock");
    const type = block.get("type");
    const material = this.blockMaterials[type];
    const obj = new THREE.Mesh(this.cube_geometry, material);
    const {x,y,z} = block.pick(["x", "y", "z"]);
    obj.position.set(x,y,z);
    this.scene.add(obj);
  },

  removeBlock: function(block){

  },

  test: function(){

    return;

    // create the sphere's material

    const materials = [
      new THREE.MeshLambertMaterial({color: 0xCC0000 }),
      new THREE.MeshLambertMaterial({color: 0x00CC00 }),
      new THREE.MeshLambertMaterial({color: 0x0000CC }),
    ];

    // Set up the sphere vars
    const RADIUS = 50;
    const SEGMENTS = 16;
    const RINGS = 16;

    const geometry = new THREE.CubeGeometry( 1,1,1 );

    // Create a new mesh with
    // sphere geometry - we will cover
    // the sphereMaterial next!

    for(let x = 0; x < 3; x++){
      for(let z = 0; z < 3; z++){
        let material = materials[Math.floor(Math.random() * 3)];
        let obj = new THREE.Mesh(geometry, material);
        obj.position.set(x,0,z);
        this.scene.add(obj);
      }
    }

  }


});