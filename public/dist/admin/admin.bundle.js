webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(56);
	module.exports = __webpack_require__(94);


/***/ },

/***/ 22:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(32)
	.extend("AdminAppController", {
	  Layout: __webpack_require__(59)
	});


/***/ },

/***/ 23:
/***/ function(module, exports, __webpack_require__) {

	const Controller  = __webpack_require__(6);
	
	module.exports = Controller.extend("DataController", {
	  initOrder: 1,
	  init: function(options, cb){
	    const app    = __webpack_require__(8);
	    const socket = app.WebsocketController;
	    const data   = __webpack_require__(25);
	    cb();
	  }
	});

/***/ },

/***/ 24:
/***/ function(module, exports, __webpack_require__) {

	var Controller = __webpack_require__(41);
	module.exports = Controller.extend("Websocket", {
	  initOrder: 0,
	  config: window.ws_connection
	});

/***/ },

/***/ 25:
/***/ function(module, exports, __webpack_require__) {

	var App = __webpack_require__(2);
	
	
	module.exports = {
	
	};

/***/ },

/***/ 26:
/***/ function(module, exports, __webpack_require__) {

	module.exports = module.exports = __webpack_require__(33).extend({
	  log: console.log.bind(console),
	});

/***/ },

/***/ 44:
/***/ function(module, exports) {

	module.exports = false;

/***/ },

/***/ 56:
/***/ function(module, exports, __webpack_require__) {

	const App = __webpack_require__(2);
	//             Config object or folder    | patch
	App.configure(   __webpack_require__(57), ({"debug":false}));
	App.controllers( __webpack_require__(58) );
	
	const app = __webpack_require__(8);
	app.init({
	  App:     App,
	  config:  __webpack_require__(3),
	  data:    __webpack_require__(25),
	  routes:  ({"":"setContext","/":"setContext","/:screen":"setContext","/:screen/:tab":"setContext","/:screen/:tab/:context":"setContext","/:screen/:tab/:context/:action":"setContext"}),
	},function(err){
	  if(err) return console.error(err.stack || err);
	});
	


/***/ },

/***/ 57:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./app.hson": 102,
		"./debug": 44,
		"./debug.json": 44
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 57;


/***/ },

/***/ 58:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./AppController": 22,
		"./AppController.js": 22,
		"./DataController": 23,
		"./DataController.js": 23,
		"./WebsocketController": 24,
		"./WebsocketController.js": 24
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 58;


/***/ },

/***/ 59:
/***/ function(module, exports, __webpack_require__) {

	var App = __webpack_require__(2);
	var _ = __webpack_require__(1);
	
	function parse(name, context, cb){ cb(name.split("/").shift()); }
	
	module.exports = __webpack_require__(26).extend({
	  template: __webpack_require__(116),
	  style: __webpack_require__(95),
	  components: _.extend(
	    App.bulk( __webpack_require__(61), parse ),
	    App.bulk( __webpack_require__(60), parse )
	  )
	});


/***/ },

/***/ 60:
/***/ function(module, exports) {

	function webpackContext(req) {
		throw new Error("Cannot find module '" + req + "'.");
	}
	webpackContext.keys = function() { return []; };
	webpackContext.resolve = webpackContext;
	module.exports = webpackContext;
	webpackContext.id = 60;


/***/ },

/***/ 61:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./Header/Header.js": 62
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 61;


/***/ },

/***/ 62:
/***/ function(module, exports, __webpack_require__) {

	var App = __webpack_require__(2);
	module.exports = __webpack_require__(26).extend({
	  template: __webpack_require__(117),
	  style:    __webpack_require__(96),
	});


/***/ },

/***/ 94:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 95:
94,

/***/ 96:
94,

/***/ 102:
/***/ function(module, exports) {

	module.exports = {"container":"body","pushState":true}

/***/ },

/***/ 116:
/***/ function(module, exports) {

	module.exports = "<div class=\"flex-toolbar\"> {{>resolveComponent(\"Header\",   {state: \"state\"})}} </div>\n<div class=\"flex-content\">Hi, Admin!</div>\n<div class=\"flex-toolbar\"> {{>resolveComponent(\"Footer\",   {state: \"state\"})}} </div>\n"

/***/ },

/***/ 117:
/***/ function(module, exports) {

	module.exports = "<h3>header</h3>"

/***/ }

});
//# sourceMappingURL=admin.bundle.js.map