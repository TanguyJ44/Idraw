import Select from '../tools/select.js';
import Pen from '../tools/pen.js';
import Rectangle from '../tools/rectangle.js';
import Circle from '../tools/circle.js';
import Text from '../tools/text.js';
import Image from '../tools/image.js';
import Eraser from '../tools/eraser.js';
import { canvas } from '../custom.js';

const tools = [
    new Select(canvas),
    new Pen(canvas),
    new Rectangle(canvas),
    new Circle(canvas),
    new Text(canvas),
    new Image(canvas),
    new Eraser(canvas)
];

function referenceTool(tool) {
    const reference = tool.reference();
    const tools = document.querySelector('#tools ul');

    const li = document.createElement('li');
    const icon = document.createElement('i');
    li.id = reference.name;
    icon.className = 'fa-solid ' + reference.icon;

    li.appendChild(icon);
    tools.appendChild(li);

    li.addEventListener('click', () => {
        selectTool(reference.name);
    });
}

function selectTool(toolId) {
    document.querySelectorAll('#tools li').forEach(function(el) {
        el.classList.remove('selected');
    });

    tools.forEach(tool => {
        tool.deselect();
        if (tool.reference().name === toolId) {
            tool.select();
        }
    });

    document.querySelector('#' + toolId).classList.add('selected');
}

tools.forEach(tool => {
    referenceTool(tool);
})
