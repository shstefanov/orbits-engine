const skip = { dispose: () => {} }

export default function createEventManager(mesh, props, scene, renderer){

    if(props.nonInteractive) return skip;

    const eventNames = Object.keys(props).filter( propname => {
        // Filter starting with "on" and being functions
        return propname.indexOf("on") === 0
            && propname !== "onCreate"
            && propname !== "onDestroy"
            && typeof props[propname] === "function";
    });

    const events = eventNames.map( listenerName => {
        const eventName = listenerName.replace("on", "").toLowerCase();
        renderer.addEventListener(eventName, listenerName, mesh, scene);
        return eventName;
    });

    return !events.length ? skip : {
        dispose: () => {
            for(let eventName of events){
                renderer.removeEventListener(eventName, mesh, scene);
            }
        }
    }

    

}