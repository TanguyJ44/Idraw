import ITool from './ITool.js';
import { getColor } from '../modules/colors.js';

// Text tool (inspired by fabric JS exemple)
class Text extends ITool {
    constructor(canvas) {
        super(canvas);
    }

    register() {
        this.canvas.on('mouse:down', (o) => {
            if (this.selected) {
                if(this.canvas.getActiveObject()) return;

                const pointer = this.canvas.getPointer(o.e);
                const uid = this.getUid();

                const text = new fabric.IText('Text', {
                    id: uid,
                    fontFamily: 'arial black',
                    left: pointer.x,
                    top: pointer.y,
                    fill: getColor(),
                });

                // add id to text object json
                text.toObject = (function(toObject) {
                    return function() {
                        return fabric.util.object.extend(toObject.call(this), {
                            id: uid
                        });
                    };
                })(text.toObject);

                this.canvas.add(text);
            }

            const objects = this.canvas.getObjects();
            objects.forEach((obj) => {
                if('text' in obj && obj.text.trim().length === 0) {
                    this.canvas.remove(obj);
                }
            });
        });
    }

    reference() {
        return {
            icon: 'fa-font',
            name: 'text'
        }
    }
}

export default Text;
