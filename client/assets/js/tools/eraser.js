import ITool from './ITool.js';

class Eraser extends ITool {
    constructor(canvas) {
        super(canvas);
    }

    register() {
        this.handleSuppr();
        this.canvas.on('mouse:down', (o) => {
            if (this.selected) {
                this.canvas.remove(this.canvas.getActiveObject());
                this.eraseClicked = true;

                this.canvas.forEachObject(function(obj) {
                    obj.selectable = false;
                });
            }
        });

        this.canvas.on('mouse:move', (o) => {
            if(this.selected && this.eraseClicked) {

                const pointer = this.canvas.getPointer(o.e);
                const objects = this.canvas.getObjects();

                for(let i = 0; i < objects.length; i++){
                    if(objects[i].containsPoint(pointer)){
                        this.canvas.remove(objects[i]);
                    }
                }
            }
        });

        this.canvas.on('mouse:up', (o) => {
            if(this.selected) {
                this.eraseClicked = false;

                this.canvas.forEachObject(function(obj) {
                    obj.selectable = true;
                });
            }
        });
    }

    handleSuppr() {
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 46) {
                this.canvas.getActiveObjects().forEach((o) => {
                    this.canvas.remove(o);
                });
            }
        });
    }

    reference() {
        return {
            icon: 'fa-eraser',
            name: 'eraser'
        }
    }
}

export default Eraser;
