import { canvas } from '../custom.js';

// add invisible button (link) to dom
const button = document.createElement('a');
button.style.display = 'none';

button.addEventListener('click', function (e) {
        button.href = canvas.toDataURL({
            format: "png"
        });

        this.download = 'canvas.png';
    }, false
);

document.body.appendChild(button);

// add screenshot button to header
const screenshotButton = document.createElement('button');
screenshotButton.innerHTML = '<i class="fa-solid fa-camera-retro"></i>';
screenshotButton.classList = 'classic';

screenshotButton.addEventListener('click', () => {
    button.click();
});

document.querySelector('header').appendChild(screenshotButton);
