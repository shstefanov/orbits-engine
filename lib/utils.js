import * as THREE from "three";

const stripUndefined = obj => {
	for(let key in obj){
		if(typeof obj[key] === "undefined"){
			delete obj[key];
		}
	}
	return obj;
}

export const materialStep = (base, diff, path) => {
	const result = { colors: {}, values:{} };
	for(let propName in base.colors){
		result.colors[propName] = stringifyColor({
			r: Math.round(base.colors[propName].r + (diff.colors[propName].r * path)),
			g: Math.round(base.colors[propName].g + (diff.colors[propName].g * path)),
			b: Math.round(base.colors[propName].b + (diff.colors[propName].b * path)),
		});
	}
	for(let propName in base.values) result.values[propName] = base.values[propName] + (diff.values[propName] * path);
	return result;
}

export const extractMaterialTransitionValues = ({ values = {}, colors = {} }) => {
	const result = { values: {}, colors: {} };
	for(let propName in values) if(typeof values[propName] === "number") result.values[propName] = values[propName];
	for(let propName in colors)  result.colors[propName] = deconstructColor(colors[propName]);
	return result;
}

export const materialDiff = (base, dest) => {
	const result = { colors: {}, values:{} };
	for(let propName in base.colors){
		result.colors[propName] = {
			r: dest.colors[propName].r - base.colors[propName].r,
			g: dest.colors[propName].g - base.colors[propName].g,
			b: dest.colors[propName].b - base.colors[propName].b,
		}
	}
	for(let propName in base.values){
		result.values[propName] = dest.values[propName] - base.values[propName];
	}
	return result;
}

export const convertMaterialProps = ({
	type, src,       // Just omit them 
	
	colors = {},

	vectors2 = {},

	vectors3 = {},

	values = {},

	constants = {},
	...props
}, textures = {}) => {
	let convertedVectors2 = {};
	if(vectors2){
		for(let propName in vectors2){
			convertedVectors2[propName] = new THREE.Vector2(...vectors2[propName]);
		}
	}

	let convertedVectors3 = {};
	if(vectors3){
		for(let propName in vectors3){
			convertedVectors3[propName] = new THREE.Vector3(...vectors3[propName]);
		}
	}

	let convertedColors = {};
	if(colors){
		for(let propName in colors){
			convertedColors[propName] = new THREE.Color(parseInt(colors[propName].replace("#", "0x"), 16));
		}
	}

	let convertedConstants = {};
	if(constants){
		for(let propName in constants){
			convertedConstants[propName] = THREE[constants[propName]];
		}
	}

	const finish = {};
	// finish.needsUpdate = true;
	values.uniforms && (finish.uniformsNeedUpdate = true);

	Object.assign(
		props,
		textures,
		convertedConstants,
		convertedColors,
		convertedVectors2,
		values,
		finish,
	);

	return props;
}




/*
	Vectors utils
*/

export const fillDefaultXYZ = ( value, { x = value, y = value, z = value } = {}) => ({ x, y, z });

export const vecAdd = (vec1, vec2)  => ({ x: vec1.x + vec2.x, y: vec1.y + vec2.y, z: vec1.z + vec2.z  });
export const vecDiff = (base, target) => {
	return {
		x: target.x - base.x,
		y: target.y - base.y,
		z: target.z - base.z,
	};
};

export const multiplyScalar = (vec, scalar) => ({ x: vec.x * scalar,  y: vec.y * scalar,  z: vec.z * scalar   });



/*
	Color utils
*/

export const colorDiff = (col1, col2) => {
	return { r: col2.r - col1.r, g: col2.g - col1.g, b: col2.b - col1.b, };
}

export const deconstructColor = (color) => {
	return {
		r: parseInt("0x" + color[1] + color[2], 16),
		g: parseInt("0x" + color[3] + color[4], 16),
		b: parseInt("0x" + color[5] + color[6], 16),
	}
}

export const colorAdd = (c1, c2) => ({ r: c1.r + c2.r, g: c1.g + c2.g, b: c1.b + c2.b });
export const multiplyColor = ({r,g,b}, n) => ({r : Math.round(r*n), g: Math.round(g*n), b: Math.round(b*n)});
export const stringifyColor = ({r, g, b}) => {
	return "#" + [
		(r < 0x10 ? "0" : "" ) + r.toString(16),
		(g < 0x10 ? "0" : "" ) + g.toString(16),
		(b < 0x10 ? "0" : "" ) + b.toString(16),
	].join("");
}





/*
	Mouse interaction utils
*/



export const interactionHandlers = {
	
	// Always bound events
	onMouseOver: function(e, props=this.props, markers=this.interactionCollider.userData.markers){
		// First enable all to get ahead of handlers exceptions
		e.target.userData.binds.enableMouseMove();
		e.target.userData.binds.enableMouseDown();
		e.target.userData.binds.enableMouseUp();
		e.target.userData.binds.enableClick();

		this.props.hover && this.setState({__hover: this.props.hover});

		this.context.setCursor(props.cursor);

		props.onMouseOver && props.onMouseOver(e);
		props.onMouseMove && props.onMouseMove(e);
		
	},

	onMouseOut: function(e, props=this.props, markers=this.interactionCollider.userData.markers){
		// First disable all to get ahead of handlers exceptions
		e.target.userData.binds.disableMouseMove();
		e.target.userData.binds.disableMouseUp();
		e.target.userData.binds.disableMouseDown();
		e.target.userData.binds.disableClick();

		this.setState({__hover: null});
		this.context.setCursor(null);

		props.onMouseOut && props.onMouseOut(e);
	},

	// Primary handlers (will be enabled after mouse enter and disabled after mouseout)
	onMouseDown: function(e, props=this.props, markers=this.interactionCollider.userData.markers){
		e.stopPropagation();
		markers.downButton = e.originalEvent.button;
		props.onMouseDown && props.onMouseDown(e);
		markers.awaitHold = setTimeout(() => {
			markers.awaitHold = 0;
			props.onHold && props.onHold(e);
			// Alter markers.downButton to prevent trigger click after mouseup
			markers.downButton = -1;
		}, 1000 );
	},

	onMouseUp: function(e, props=this.props, markers=this.interactionCollider.userData.markers){
		e.stopPropagation();
		markers.upButton = e.originalEvent.button;
		props.onMouseUp && props.onMouseUp(e);
		markers.enableClick && (markers.downButton !== -1) && e.target.userData.binds.onClick(e);
	},

	onMouseMove: function(e, props=this.props, markers=this.interactionCollider.userData.markers){
		props.onMouseMove && props.onMouseMove(e);
	},

	// Artific
	onClick: function(e, props=this.props, markers=this.interactionCollider.userData.markers, binds=this.interactionCollider.userData.binds){

		if((markers.downButton !== markers.upButton)){
			markers.lastClick = 0;
			return;
		}

		switch(markers.upButton){
			case 0: {
				// Handle Double Click
				if(markers.lastClick && Date.now() - markers.lastClick < 150){
					props.onDoubleClick && props.onDoubleClick(e);
					markers.lastClick = 0;
				}
				// Handle single click
				else{
					markers.lastClick = Date.now();
					props.onClick && props.onClick(e);
				}
				break;
			}

			case 1: {
					markers.lastClick = 0;
					props.onMiddleClick && props.onMiddleClick(e);
					break;
			}
			case 2: {
					markers.lastClick = 0;
					props.onContext && props.onContext(e);
					break;
			}
		}
	},

	// Helper Function 
	enableMouseMove: function(){
		this.interactionCollider.addEventListener("mousemove", this.interactionCollider.userData.binds.onMouseMove);
	},
	
	disableMouseMove: function(){
		this.interactionCollider.removeEventListener("mousemove", this.interactionCollider.userData.binds.onMouseMove);
	},

	enableMouseDown: function(){
		this.interactionCollider.addEventListener("mousedown", this.interactionCollider.userData.binds.onMouseDown);
	},
	
	disableMouseDown: function(){
		this.interactionCollider.removeEventListener("mousedown", this.interactionCollider.userData.binds.onMouseDown);
	},

	enableMouseUp: function(){
		this.interactionCollider.addEventListener("mouseup", this.interactionCollider.userData.binds.onMouseUp);
	},
	
	disableMouseUp: function(){
		this.interactionCollider.removeEventListener("mouseup", this.interactionCollider.userData.binds.onMouseUp);
		const markers = this.interactionCollider.userData.markers
		markers.awaitHold && clearTimeout(markers.awaitHold)
		markers.awaitHold = 0;
	},

	enableClick: function(markers=this.interactionCollider.userData.markers){
		markers.enableClick=true;
		markers.lastClick = 0;
	},

	disableClick: function(markers=this.interactionCollider.userData.markers){
		markers.enableClick=false;
	},
};

export const interactionPropsNames = [
	"hover",
	"cursor",
	"onClick",
	"onDoubleClick",
	"onMiddleClick",
	"onContext",
	"onHold",
	"onMouseDown",
	"onMouseUp",
	"onMouseOver",
	"onMouseOut",
	"onMouseMove",
	"onTouchStart",
	"onTouchCancel",
	"onTouchMove",
	"onTouchEnd",
	"interactive",
];