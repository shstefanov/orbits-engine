export function rgbComponents( color ){ 
    const   r = (color >> 16),        ra = r << 16,
            g = (( color - ra) >> 8), ga = g << 8,
            b = color - ra - ga;
    return [ r / 255 , g / 255 , b / 255  ];
}

export function rgbaComponents( color ){
    const rgb = Math.floor(color / 0x100);
    const a = (color - rgb * 0x100);
    return [ ...rgbComponents(rgb), a / 255 ];
}
