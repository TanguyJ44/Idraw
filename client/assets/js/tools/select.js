import ITool from './ITool.js';
import { canvas } from "../custom.js";

class Select extends ITool {
    constructor(canvas) {
        super(canvas);
    }

    register() {
        return false;
    }

    reference() {
        return {
            icon: 'fa-arrow-pointer',
            name: 'select'
        }
    }
}

export default Select;
