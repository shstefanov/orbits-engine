import OrbitsScene      from "./lib/OrbitsScene"
import Object3Component from "./lib/Object3Component"


import AmbientLight     from "./lib/components/AmbientLight"
import PointLight       from "./lib/components/PointLight"
import SpotLight        from "./lib/components/SpotLight"
import DirectionalLight from "./lib/components/DirectionalLight"

import Fog              from "./lib/components/Fog"

import ObjLoader        from "./lib/components/ObjLoader"

import Point            from "./lib/components/geometries/Point"
import Points           from "./lib/components/geometries/Points"
import Line             from "./lib/components/geometries/Line"
import Box              from "./lib/components/geometries/Box"

import Circle           from "./lib/components/geometries/Circle";
import Cone             from "./lib/components/geometries/Cone";
import Cylinder         from "./lib/components/geometries/Cylinder";
import Dodecahedron     from "./lib/components/geometries/Dodecahedron";
import Extrude          from "./lib/components/geometries/Extrude";
import Icosahedron      from "./lib/components/geometries/Icosahedron";
import Lathe            from "./lib/components/geometries/Lathe";
import Octahedron       from "./lib/components/geometries/Octahedron";
import Plane            from "./lib/components/geometries/Plane";
import Polyhedron       from "./lib/components/geometries/Polyhedron";
import Ring             from "./lib/components/geometries/Ring";
import Shape            from "./lib/components/geometries/Shape";
import Sphere           from "./lib/components/geometries/Sphere";
import Tetrahedron      from "./lib/components/geometries/Tetrahedron";
import Torus            from "./lib/components/geometries/Torus";
import TorusKnot        from "./lib/components/geometries/TorusKnot";
import Tube             from "./lib/components/geometries/Tube";
import Surface          from "./lib/components/geometries/Surface";
// import Text             from "./lib/components/geometries/Text";
import Sprite           from "./lib/components/geometries/Sprite";

import Audio            from "./lib/components/Audio";
import AudioEffect      from "./lib/components/AudioEffect";
import PositionalAudio  from "./lib/components/PositionalAudio";

import Group            from "./lib/components/Group";

import CameraControls   from "./lib/components/CameraControls";
import Timer            from "./lib/components/Timer";

export {
	OrbitsScene,
	Object3Component,

	// Geometries
	Point,
	Points,
	Line,
	Box,
	Circle,
	Cone,
	Cylinder,
	Dodecahedron,
	Extrude,
	Icosahedron,
	Lathe,
	Octahedron,
	Plane,
	Polyhedron,
	Ring,
	Shape,
	Sphere,
	Tetrahedron,
	Torus,
	TorusKnot,
	Tube,
	Surface,
	// Text,
	Sprite,

	// Lights
	AmbientLight,
	PointLight,
	SpotLight,
	DirectionalLight,

	// Fog
	Fog,

	// Loaders
	ObjLoader,

	// Audio
	Audio,
	AudioEffect,
	PositionalAudio,

	Group,

	CameraControls,
	Timer,
}