import ITool from './ITool.js';
import {getColor, setCallback} from '../modules/colors.js';
import {canvas} from "../custom.js";

// Pen tool (inspired by fabric JS exemple)
class Pen extends ITool {
    constructor(canvas) {
        super(canvas);
    }

    register() {
        this.canvas.isDrawingMode = false;
        this.canvas.freeDrawingBrush.width = 10;

        // add custom prop to drawing object
        canvas.on('path:created', (e) => {
            if (this.selected) {
                const uid = this.getUid();
                e.path.id = uid;

                e.path.toObject = (function (toObject) {
                    return function () {
                        return fabric.util.object.extend(toObject.call(this), {
                            id: uid
                        });
                    };
                })(e.path.toObject);

                this.canvas.fire('object:added', {
                    target: e.path
                });
            }
        });


        // detect color change
        setCallback(this.handleColorChange.bind(this));
    }

    handleColorChange() {
        this.canvas.freeDrawingBrush.color = getColor();
    }

    select() {
        this.selected = true;
        this.canvas.isDrawingMode = true;
    }

    deselect() {
        this.selected = false;
        this.canvas.isDrawingMode = false;
    }

    reference() {
        return {
            icon: 'fa-pen',
            name: 'pen'
        }
    }
}

export default Pen;
