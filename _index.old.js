import OrbitsScene      from "./lib.old/OrbitsScene"
import Object3Component from "./lib.old/Object3Component"


import AmbientLight     from "./lib.old/components/AmbientLight"
import PointLight       from "./lib.old/components/PointLight"
import SpotLight        from "./lib.old/components/SpotLight"
import DirectionalLight from "./lib.old/components/DirectionalLight"

import Fog              from "./lib.old/components/Fog"

import ObjLoader        from "./lib.old/components/ObjLoader"

import Point            from "./lib.old/components/geometries/Point"
import Points           from "./lib.old/components/geometries/Points"
import Line             from "./lib.old/components/geometries/Line"
import Box              from "./lib.old/components/geometries/Box"

import Circle           from "./lib.old/components/geometries/Circle";
import Cone             from "./lib.old/components/geometries/Cone";
import Cylinder         from "./lib.old/components/geometries/Cylinder";
import Dodecahedron     from "./lib.old/components/geometries/Dodecahedron";
import Extrude          from "./lib.old/components/geometries/Extrude";
import Icosahedron      from "./lib.old/components/geometries/Icosahedron";
import Lathe            from "./lib.old/components/geometries/Lathe";
import Octahedron       from "./lib.old/components/geometries/Octahedron";
import Plane            from "./lib.old/components/geometries/Plane";
import Polyhedron       from "./lib.old/components/geometries/Polyhedron";
import Ring             from "./lib.old/components/geometries/Ring";
import Shape            from "./lib.old/components/geometries/Shape";
import Sphere           from "./lib.old/components/geometries/Sphere";
import Tetrahedron      from "./lib.old/components/geometries/Tetrahedron";
import Torus            from "./lib.old/components/geometries/Torus";
import TorusKnot        from "./lib.old/components/geometries/TorusKnot";
import Tube             from "./lib.old/components/geometries/Tube";
import Text             from "./lib.old/components/geometries/Text";
import Sprite           from "./lib.old/components/geometries/Sprite";

import Audio            from "./lib.old/components/Audio";
import AudioEffect      from "./lib.old/components/AudioEffect";
import PositionalAudio  from "./lib.old/components/PositionalAudio";

import Group            from "./lib.old/components/Group";

import CameraControls   from "./lib.old/components/CameraControls";
import Timer            from "./lib.old/components/Timer";

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
	Text,
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