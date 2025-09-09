import { useScene } from "../OrbitsScene.jsx";

export default function useCamera( scene = useScene() ){
    return scene?.camera || ( scene.parent && useCamera(scene.parent) );
}