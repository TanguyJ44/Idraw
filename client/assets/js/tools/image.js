import ITool from './ITool.js';

class Image extends ITool {
    constructor(canvas) {
        super(canvas);
    }

    register() {
        this.domInsert();
        this.canvas.on('mouse:down', (o) => {
            if (this.selected) {
                if(this.canvas.getActiveObject()) return;

                const uid = this.getUid();
                document.querySelector('#selectFile').click();

                document.querySelector('#selectFile').addEventListener('change', (e) => {
                    if(!e.target.files[0]) return;

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        fabric.Image.fromURL(e.target.result, (oImg) => {
                            const pointer = this.canvas.getPointer(o.e);
                            oImg.set({
                                id: uid,
                                left: pointer.x,
                                top: pointer.y,
                            });

                            oImg.toObject = (function(toObject) {
                                return function() {
                                    return fabric.util.object.extend(toObject.call(this), {
                                        id: uid
                                    });
                                };
                            })(oImg.toObject);

                            this.canvas.add(oImg);
                            this.canvas.setActiveObject(oImg);
                        },{ crossOrigin: "anonymous" });
                    }
                    reader.readAsDataURL(e.target.files[0]);
                });
            }
        });
    }

    domInsert() {
        const selectFile = document.createElement('input');
        selectFile.type = 'file';
        selectFile.id = 'selectFile';
        selectFile.style.display = 'none';
        document.body.appendChild(selectFile);
    }

    reference() {
        return {
            icon: 'fa-image',
            name: 'image'
        }
    }
}

export default Image;
