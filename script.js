const lights = document.querySelectorAll('.light');
const startButton = document.getElementById('startButton');
const timerDisplay = document.getElementById('timer');
const messageDisplay = document.getElementById('message');

let timer = null;
let startTime = null;
let lightsOut = false;
let lightsOnSequence = false;
let preLightsOutDelay = false;
let falseStart = false;
let sequenceInterval = null;
let lightsOffTimeout = null;

// Start button
startButton.addEventListener('click', startGame);
// Document click
document.addEventListener('click', handleClick);

function startGame() {
    resetGame();
    falseStart = false;
    startButton.disabled = true;
    startButton.textContent = "Start Game";
    initiateLightSequence();
}

function initiateLightSequence() {
    let index = 0;
    lightsOnSequence = true;

    sequenceInterval = setInterval(() => {
        if (index < lights.length) {
            lights[index].classList.add('active');
            index++;
        } else {
            clearInterval(sequenceInterval);
            sequenceInterval = null;
            lightsOnSequence = false;

            preLightsOutDelay = true;
            lightsOffTimeout = setTimeout(() => {
                preLightsOutDelay = false;
                if (!falseStart) {
                    turnOffLights();
                }
            }, randomDelay());
        }
    }, 1000);
}

function handleClick(event) {
    if (event.target === startButton) return;

    if (lightsOnSequence || preLightsOutDelay) {
        // False start
        falseStart = true;
        messageDisplay.textContent = "False Start! Click 'Start Game' to try again.";

        // Stop sequence and timer
        if (sequenceInterval) {
            clearInterval(sequenceInterval);
            sequenceInterval = null;
        }
        if (lightsOffTimeout) {
            clearTimeout(lightsOffTimeout);
            lightsOffTimeout = null;
        }

        preLightsOutDelay = false;
        lightsOnSequence = false;
        lights.forEach(light => light.classList.remove('active'));
        startButton.disabled = false;
    } else if (lightsOut && !falseStart) {
        // Valid reaction
        clearInterval(timer);
        lightsOut = false;
        const reactionTime = ((performance.now() - startTime) / 1000).toFixed(3);
        timerDisplay.textContent = `${reactionTime}s`;
        startButton.disabled = false;
    }
}

function turnOffLights() {
    lights.forEach(light => light.classList.remove('active'));
    lightsOut = true;
    startTime = performance.now();
    startTimer();
}

function startTimer() {
    timer = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        timerDisplay.textContent = elapsed.toFixed(3) + 's';
    }, 10);
}

function resetGame() {
    if (timer) clearInterval(timer);
    if (sequenceInterval) clearInterval(sequenceInterval);
    if (lightsOffTimeout) clearTimeout(lightsOffTimeout);
    sequenceInterval = null;
    lightsOffTimeout = null;
    lights.forEach(light => light.classList.remove('active'));
    timerDisplay.textContent = "0.000s";
    messageDisplay.textContent = "";
    startButton.disabled = false;
    startButton.textContent = "Start Game";
    startTime = null;
    lightsOut = false;
    lightsOnSequence = false;
    preLightsOutDelay = false;
    falseStart = false;
}

function randomDelay() {
    return Math.random() * (3000 - 200) + 200; // 0.2s to 3s
}
