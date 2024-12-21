import { useScene } from "../OrbitsScene.jsx";

export default function useCamera( scene = useScene() ){
    return scene?.camera || ( scene.patent && useCamera(scene.parent) );
}