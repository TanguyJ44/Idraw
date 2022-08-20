// Itool class for all tools system (inspired by fabric JS exemple)
class ITool {
    constructor(canvas) {
        if (this.constructor === ITool) {
            throw new TypeError('Abstract class "AbstractConfig" cannot be instantiated directly');
        }
        this.canvas = canvas;
        this.selected = false;

        this.register();
    }

    register() {
        throw new Error('You must implement this function');
    }

    reference() {
        throw new Error('You must implement this function');
    }

    select() {
        this.selected = true;
    }

    deselect() {
        this.selected = false;
    }

    getUid() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}

export default ITool;
