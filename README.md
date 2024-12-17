





# Renderer
The component
```jsx
import { OrbitsRenderer } from "@orbits/engine";
export default function MyApp(){
    return <OrbitsRenderer

        // Optional className for canvas dom element (ignored if "canvas" option provided)
        className="my-canvas-class"

        // Canvas and renderer style
        size={{ width: 1000, height: 300 }}

        autoresize={true} // --

        // Optional inline style for canvas dom element (ignored if "canvas" option provided)
        style={{ backgroundColor: "black" }}

        // And all constructor options, provided by threejs, including "canvas"
        // https://threejs.org/docs/?q=Renderer#api/en/renderers/WebGLRenderer
        // Option "canvas" means it is externally created and managed,
        // so "className", "style" and "size" props will be ignored

    >
        {/* Children components here */}
    </OrbitsRenderer>;
}
```

The hook
```js
import { useRenedrer } from "@orbits/engine";
```