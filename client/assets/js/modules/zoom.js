import { canvas } from '../custom.js';

// Define zoom logic in canvas (recovered in fabric JS exemple)
canvas.on('mouse:wheel', function(opt) {
    const delta = opt.e.deltaY;

    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;

    if (zoom > 5) zoom = 5;
    if (zoom < 0.5) zoom = 0.5;

    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
})
