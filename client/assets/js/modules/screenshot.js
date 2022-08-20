import { canvas } from '../custom.js';

// Add invisible button (link) to dom
const button = document.createElement('a');
button.style.display = 'none';

// On click, screen canvas to download it (default name canvas.png)
button.addEventListener('click', function (e) {
        button.href = canvas.toDataURL({
            format: "png"
        });

        this.download = 'canvas.png';
    }, false
);

document.body.appendChild(button);

// Add screenshot button to header
const screenshotButton = document.createElement('button');
screenshotButton.innerHTML = '<i class="fa-solid fa-camera-retro"></i>';
screenshotButton.classList = 'classic';

// Click event screenshot button
screenshotButton.addEventListener('click', () => {
    button.click();
});

document.querySelector('header').appendChild(screenshotButton);
