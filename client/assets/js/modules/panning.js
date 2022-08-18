import { canvas } from '../custom.js';

const STATE_IDLE = 'idle';
const STATE_PANNING = 'panning';

let lastClientX;
let lastClientY;

fabric.Canvas.prototype.panState = STATE_IDLE;
fabric.Canvas.prototype.panMouseMoveHandler = async function(e) {
    if (this.panState === STATE_PANNING && e && e.e) {
        let deltaX = 0;
        let deltaY = 0;
        if (lastClientX) {
            deltaX = e.e.clientX - lastClientX;
        }
        if (lastClientY) {
            deltaY = e.e.clientY - lastClientY;
        }
        lastClientX = e.e.clientX;
        lastClientY = e.e.clientY;

        let delta = new fabric.Point(deltaX, deltaY);
        this.relativePan(delta);
    }
};
fabric.Canvas.prototype.panMouseUpHandler = function(e) {
    if (e.e.button === 2) {
        this.panState = STATE_IDLE;
        this.defaultCursor = 'default';
    }
};
fabric.Canvas.prototype.panMouseDownHandler = function(e) {
    if (e.e.button === 2) {
        this.panState = STATE_PANNING;
        lastClientX = e.e.clientX;
        lastClientY = e.e.clientY;
        this.defaultCursor = 'move';
    }
};
fabric.Canvas.prototype.toggleDragMode = function(dragMode) {
    if (dragMode) {
        this.discardActiveObject();
        this.forEachObject(function(object) {
            object.prevEvented = object.evented;
            object.prevSelectable = object.selectable;
            object.evented = false;
            object.selectable = false;
        });
        this.on('mouse:up:before', this.panMouseUpHandler);
        this.on('mouse:down:before', this.panMouseDownHandler);
        this.on('mouse:move', this.panMouseMoveHandler);
    } else {
        this.forEachObject(function(object) {
            object.evented = (object.prevEvented !== undefined) ? object.prevEvented : object.evented;
            object.selectable = (object.prevSelectable !== undefined) ? object.prevSelectable : object.selectable;
        });
        this.off('mouse:up:before', this.panMouseUpHandler);
        this.off('mouse:down:before', this.panMouseDownHandler);
        this.off('mouse:move', this.panMouseMoveHandler);
    }
};

canvas.toggleDragMode(true);
document.oncontextmenu = () => false;
