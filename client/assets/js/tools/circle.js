import ITool from './ITool.js';
import { getColor } from '../modules/colors.js';

class Circle extends ITool {
    constructor(canvas) {
        super(canvas);
    }

    register() {
        let circle, isDown, origX, origY, lastLeft, lastTop;

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
                    rx: 0,
                    ry: 0,
                    angle: 0,
                    transparentCorners: false
                };

                props.fill = getColor();
                circle = new fabric.Ellipse(props);

                lastLeft = circle.left;
                lastTop = circle.top;

                circle.toObject = (function(toObject) {
                    return function() {
                        return fabric.util.object.extend(toObject.call(this), {
                            id: uid
                        });
                    };
                })(circle.toObject);

                this.canvas.add(circle);
                this.canvas.setActiveObject(circle);
            }
        });

        this.canvas.on('mouse:move', (o) => {
            if (this.selected) {
                if (this.canvas.getActiveObject() !== circle) {
                    return;
                }
                if (!isDown) return;
                const pointer = this.canvas.getPointer(o.e);

                if(origX > pointer.x){
                    circle.set({ left: Math.abs(pointer.x) });
                }
                if(origY > pointer.y){
                    circle.set({ top: Math.abs(pointer.y) });
                }

                lastLeft = circle.left;
                lastTop = circle.top;

                circle.set({
                    rx: Math.abs(origX - pointer.x) / 2,
                    ry: Math.abs(origY - pointer.y) / 2
                });

                this.canvas.renderAll();
            }
        });

        this.canvas.on('mouse:up', (o) => {
            if (this.selected) {
                if (this.canvas.getActiveObject() !== circle || !isDown) {
                    return;
                }

                isDown = false;

                if (circle?.width < 1 || circle?.height < 1) {
                    this.canvas.remove(circle);
                } else {
                    // clone circle object
                    const clone = JSON.parse(JSON.stringify(circle));
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
            icon: 'fa-circle',
            name: 'circle'
        }
    }
}

export default Circle;
