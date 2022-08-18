import ITool from './ITool.js';
import { getColor } from '../modules/colors.js';

class Rectangle extends ITool {
    constructor(canvas) {
        super(canvas);
    }

    register() {
        let rect, isDown, origX, origY, lastLeft, lastTop;

        this.canvas.on('mouse:down', (o) => {
            if (this.selected) {
                if (this.canvas.getActiveObject()) {
                    return;
                }
                const pointer = this.canvas.getPointer(o.e);
                const uid = this.getUid();

                isDown = true;
                origX = pointer.x;
                origY = pointer.y;
                const props = {
                    id: uid,
                    left: origX,
                    top: origY,
                    originX: 'left',
                    originY: 'top',
                    width: pointer.x-origX,
                    height: pointer.y-origY,
                    angle: 0,
                    transparentCorners: false
                };
                props.fill = getColor();
                rect = new fabric.Rect(props);

                lastLeft = rect.left;
                lastTop = rect.top;

                rect.toObject = (function(toObject) {
                    return function() {
                        return fabric.util.object.extend(toObject.call(this), {
                            id: uid
                        });
                    };
                })(rect.toObject);

                this.canvas.add(rect);
                this.canvas.setActiveObject(rect);
            }
        });

        this.canvas.on('mouse:move', (o) => {
            if (this.selected) {
                if (this.canvas.getActiveObject() !== rect) {
                    return;
                }

                if (!isDown) return;
                const pointer = this.canvas.getPointer(o.e);

                if(origX > pointer.x){
                    rect.set({ left: Math.abs(pointer.x) });
                }
                if(origY > pointer.y){
                    rect.set({ top: Math.abs(pointer.y) });
                }

                lastLeft = rect.left;
                lastTop = rect.top;

                rect.set({ width: Math.abs(origX - pointer.x) });
                rect.set({ height: Math.abs(origY - pointer.y) });

                this.canvas.renderAll();
            }
        });

        this.canvas.on('mouse:up', (o) => {
            if (this.selected) {
                if (this.canvas.getActiveObject() !== rect || !isDown) {
                    return;
                }

                isDown = false;

                if (rect?.width < 1 || rect?.height < 1) {
                    this.canvas.remove(rect);
                } else {
                    // clone rect object
                    const clone = JSON.parse(JSON.stringify(rect));
                    clone.left = lastLeft;
                    clone.top = lastTop;

                    this.canvas.fire('object:modified', {
                        target: clone
                    });
                }
            }
        });
    }

    reference() {
        return {
            icon: 'fa-square',
            name: 'rectangle'
        }
    }
}

export default Rectangle;
