import ITool from './ITool.js';
import { canvas } from "../custom.js";

// Select tool (inspired by fabric JS exemple)
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
