export function rgbComponents( color,
    r = (color >> 16),
    g = ((color-(r*0x10000)) >> 8),
    b = ((color-(r*0x10000) - (g * 0x100)) )

){ return [r/255, g/255, b/255] }

export function rgbaComponents( color,
    r = (color >> 24),
    g = ((color-(r*0x1000000)) >> 16),
    b = ((color-(r*0x1000000) - (g * 0x10000)) >> 8 ),
    a = ((color-(r*0x1000000) - (g * 0x10000)) - (b * 0x100) )

){ return [r/255, g/255, b/255, a/255] }