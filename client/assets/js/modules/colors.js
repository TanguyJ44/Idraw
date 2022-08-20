// Define color palette
const colors = [
    '#1D1C1A',
    '#D26466',
    '#BEE5B0',
    '#C9D6E8',
    '#F8F1AE',
    '#A4D8D8',
    '#D27EDF',
    '#ffffff'
]
const colorsEl = document.querySelector('#colors ul');
colors.forEach(color => {
    const li = document.createElement('li');
    const icon = document.createElement('i');
    icon.classList = 'fa-solid fa-square';
    icon.style.color = color;
    li.appendChild(icon);
    colorsEl.appendChild(li);
});

// Select default black color
colorsEl.children[0].children[0].classList.add('active');

// Black color
let color = '#000000';

const callbacks = [];
export function setCallback(callback) {
    callbacks.push(callback);
}

// On click on color
// Switch color and select it
colorsEl.addEventListener('click', function(e) {
    if (e.target.tagName === 'I') {
        color = e.target.style.color;

        const active = document.querySelectorAll('#colors ul li i.active');
        active.forEach(el => {
            el.classList.remove('active');
        });

        e.target.classList.add('active');

        callbacks.forEach(callback => {
            callback(color);
        });
    }
});

// Export color module
export function getColor() {
    return color;
}
