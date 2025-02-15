import React, { useEffect, useMemo, useState } from "react";
import * as THREE  from "three";
import { useMesh } from "../objects/Mesh.jsx";
import { useRenderer } from "../OrbitsRenderer.jsx";

export function BoxGeometry({ size: [width, height, depth], segments:[widthSegments, heightSegments, depthSegments] }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const geometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
        applyGeometry(renderer, mesh, geometry);
    }, [ width, height, depth, widthSegments, heightSegments, depthSegments ]);
    return null;
}

export function CapsuleGeometry({ radius, length, capSegments, radialSegments }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const geometry = new THREE.CapsuleGeometry(radius, length, capSegments, radialSegments);
        applyGeometry(renderer, mesh, geometry);
    }, [ radius, length, capSegments, radialSegments ]);
    return null;
}

export function CircleGeometry({ radius, segments }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const geometry = new THREE.CircleGeometry(radius, segments);
        applyGeometry(renderer, mesh, geometry);
    }, [ radius, segments ]);
    return null;
}

export function ConeGeometry({ radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const geometry = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
        applyGeometry(renderer, mesh, geometry);
    }, [ radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength ]);
    return null;
}

export function CylinderGeometry({ radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
        applyGeometry(renderer, mesh, geometry);
    }, [ radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength ]);
    return null;
}

export function DodecahedronGeometry({ radius, detail }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const geometry = new THREE.DodecahedronGeometry( radius, detail );
        applyGeometry(renderer, mesh, geometry);
    }, [ radius, detail ]);
    return null;
}

export function ExtrudeGeometry({ shape, steps, depth, bevelEnabled, bevelThickness, bevelSize, bevelOffset, bevelSegments, curveSegments, extrudePath, extrudePathType }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const new_shape = createShape(shape);
        if(extrudePath) extrudePath = createCurve(extrudePath, extrudePathType);
        const geometry = new THREE.ExtrudeGeometry( new_shape, { steps, depth, bevelEnabled, bevelThickness, bevelSize, bevelOffset, bevelSegments, curveSegments, extrudePath } );
        applyGeometry(renderer, mesh, geometry);
    }, [ shape, steps, depth, bevelEnabled, bevelThickness, bevelSize, bevelOffset, bevelSegments, curveSegments, extrudePath, extrudePathType ]);
    return null;
}

export function IcosahedronGeometry({ radius, detail }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const geometry = new THREE.IcosahedronGeometry( radius, detail );
        applyGeometry(renderer, mesh, geometry);
    }, [ radius, detail ]);
    return null;
}

export function LatheGeometry({ points, segments, phiStart, phiLength }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const vwPoints = points.map( ({x,y}) => new THREE.Vector2(x,y) );
        const geometry = new THREE.LatheGeometry( points, segments, phiStart, phiLength );
        applyGeometry(renderer, mesh, geometry);
    }, [ points.length ? points : empty, segments, phiStart, phiLength ]);
    return null;
}

export function OctahedronGeometry({ radius, detail }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const geometry = new THREE.OctahedronGeometry( radius, detail );
        applyGeometry(renderer, mesh, geometry);
    }, [ radius, detail ]);
    return null;
}

export function PlaneGeometry({ width, height, widthSegments, heightSegments }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const geometry = new THREE.PlaneGeometry( width, height, widthSegments, heightSegments );
        applyGeometry(renderer, mesh, geometry);
    }, [ width, height, widthSegments, heightSegments ]);
    return null;
}

export function PolyhedronGeometry({ points, indices, radius, detail }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    let bufferPoints = []; for(let {x,y,z} of points) bufferPoints.push(x,y,z);
    useEffect(() => {
        const geometry = new THREE.PolyhedronGeometry( bufferPoints, indices, radius, detail );
        applyGeometry(renderer, mesh, geometry);
    }, [ points, indices, radius, detail ]);
    return null;
}

export function RingGeometry({ innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const geometry = new THREE.RingGeometry( innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength );
        applyGeometry(renderer, mesh, geometry);
    }, [ innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength ]);
    return null;
}

export function ShapeGeometry({ shape, detail }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const new_shape = createShape(shape);
        const geometry = new THREE.ShapeGeometry( new_shape, detail );
        applyGeometry(renderer, mesh, geometry);
    }, [ shape, detail ]);
    return null;
}

export function SphereGeometry({ radius, widthSegments, heightSegments, thetaStart, thetaLength, phiStart, phiLength }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments, thetaStart, thetaLength, phiStart, phiLength );
        applyGeometry(renderer, mesh, geometry);
    }, [ radius, widthSegments, heightSegments, thetaStart, thetaLength, phiStart, phiLength ]);
    return null;
}

export function TetrahedronGeometry({ radius, detail }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const geometry = new THREE.TetrahedronGeometry( radius, detail );
        applyGeometry(renderer, mesh, geometry);
    }, [ radius, detail ]);
    return null;
}

export function TorusGeometry({ radius, tubeRadius, radialSegments, tubularSegments, arc }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const geometry = new THREE.TorusGeometry( radius, tubeRadius, radialSegments, tubularSegments, arc );
        applyGeometry(renderer, mesh, geometry);
    }, [ radius, tubeRadius, radialSegments, tubularSegments, arc ]);
    return null;
}

export function TorusKnotGeometry({ radius, tubeRadius, tubularSegments, radialSegments, p, q }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        const geometry = new THREE.TorusKnotGeometry( radius, tubeRadius, tubularSegments, radialSegments, p, q );
        applyGeometry(renderer, mesh, geometry);
    }, [ radius, tubeRadius, tubularSegments, radialSegments, p, q ]);
    return null;
}

export function TubeGeometry({ tubularSegments, radius, radialSegments, closed, path, pathType }){
    const renderer = useRenderer();
    const mesh     = useMesh();
    useEffect(() => {
        if(path) extrudePath = createCurve(path, pathType);
        const geometry = new THREE.TubeGeometry( extrudePath, tubularSegments, radius, radialSegments, closed );
        applyGeometry(renderer, mesh, geometry);
    }, [ path, pathType, tubularSegments, radius, radialSegments, closed ]);
    return null;
}




const empty = [];

export function applyGeometry(renderer, mesh, geometry){
    const old_geometry = mesh.mesh?.geometry;
    mesh.geometry = geometry;
    old_geometry && old_geometry.dispose();
    renderer.render();
}

function createShape(path){
    if(Array.isArray(path[0])) return path.map(createShape);
    const shape = new THREE.Shape();
    for(let { type = "move", ...props } of path) switch (type) {
        
        case "move":        { shape.moveTo( props.x, props.y ); break; }
        case "line":        { shape.lineTo( props.x, props.y ); break; }
        
        case "arc":
        case "absarc":      {
            const { x, y, radius, startAngle = 0, endAngle = Math.PI * 2, clockwise = false } = props;
            shape[type](x, y, radius, startAngle, endAngle, clockwise);
            break;
        }
        case "ellipse":
        case "absellipse":      {
            const { x, y, xRadius, yRadius, startAngle = 0, endAngle = Math.PI * 2, clockwise = false, rotation = 0 } = props;
            shape[type](x, y, xRadius, yRadius, startAngle, endAngle, clockwise, rotation);
            break;
        }

        case "bezierCurve":    { shape.bezierCurveTo( props.cp1.x, props.cp1.y, props.cp2.x, props.cp2.y, props.x, props.y ); break; }
        case "quadraticCurve": { shape.quadraticCurveTo( props.cp.x, props.cp.y, props.x, props.y ); break; }

        case "spline":
        case "points": {
            const points = props.points.map( ({x, y}) => new THREE.Vector2(x, y) );
            shape[ type === "points" ? "setFromPoints": "splineThru" ](points);
            break;
        }

        default: throw new Error(`Unknowt path step type: ${type}`);
    }


    return shape;
}

function createCurve(points, type = "Line"){
    
    const linePoints = points.map(({x, y, z}) => new THREE.Vector3(x, y, z));
    switch(type){
        case "Line":            return createLineSegments(points);
        case "QuadraticBezier": return createCurveSegments(points, 3, THREE.QuadraticBezierCurve3);
        case "CubicBezier":     return createCurveSegments(points, 4, THREE.CubicBezierCurve3);
        case "CatmullRom":      {
            const curvePath = new THREE.CurvePath();
            curvePath.add(new THREE.CatmullRomCurve3(linePoints));
            return curvePath;
        }
    }
}

function createLineSegments(points){
    const curvePath  = new THREE.CurvePath();
    const linePoints = points.map(({x, y, z}) => new THREE.Vector3(x, y, z));
    for(let i = 0; i < points.length; i++){
        if(linePoints[i + 1]) curvePath.add(new THREE.LineCurve3(linePoints[i], linePoints[i + 1]));
    }
    return curvePath;
}

function createCurveSegments(points, n, CurvePrototype){
    const curvePath  = new THREE.CurvePath();
    const linePoints = points.map(({x, y, z}) => new THREE.Vector3(x, y, z));
    for(let i = 0; i < points.length; i+=n){
        const set = [];
        for(let p = 0; p < n; p++){
            set.push(linePoints[i+p]);
        }
        curvePath.add(new CurvePrototype(...set));
    }

    return curvePath;
}