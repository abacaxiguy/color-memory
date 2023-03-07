// Math.floor(Math.random() * 6);

// lets try to do a function
// why?, idk

const colors = document.querySelectorAll(".color"),
    audios = document.querySelectorAll("audio"),
    start = document.querySelector(".start"),
    errorAudio = document.querySelector(".error");

let playerTurn = false,
    muted = false,
    timesClicked = -1,
    level = 1,
    sequence = [];

function addNewColor() {
    let isConsecutive = false;
    
    while (!isConsecutive) {
        let random = Math.floor(Math.random() * 6);
        if (random != sequence[sequence.length - 1]) {
            sequence.push(random);
            isConsecutive = true;
        }
    }
}

function playAllSequence(number) {
    start.innerHTML = "Playing...";
    toggleColorClick(true);

    let i = sequence[number];

    colors.forEach((c) => {
        if (c.getAttribute("data-color") == i) c.classList.add("active");
    });

    if (!muted) {
        audios.forEach((a) => {
            if (a.getAttribute("data-audio") == i) a.play();
        });   
    }

    setTimeout(() => {
        colors.forEach((c) => {
            if (c.getAttribute("data-color") == i) c.classList.remove("active");
        });
        number++;

        if (number < sequence.length) playAllSequence(number);
        else {
            playerTurn = true;
            toggleColorClick(false);
            timesClicked = -1;
            start.innerHTML = "Click!";
        }
    }, 500);
}

function letPlayerClick(e) {
    if (!playerTurn) return;

    timesClicked++;

    e.target.classList.add("active");
    
    if (!muted) {
        audios.forEach((a) => {
            if (a.getAttribute("data-audio") == e.target.getAttribute("data-color")) a.play();
        });
    }

    setTimeout(() => {
        e.target.classList.remove("active");
    }, 500);

    if (e.target.getAttribute("data-color") != sequence[timesClicked]) youLost();
    
    else if (timesClicked == sequence.length - 1) {
        addNewColor();
        level++;
        putLevelNumber(level);
        setTimeout(() => {
            playAllSequence(0);
        }, 1000);
    }
}

function youLost() {
    if (!muted) errorAudio.play();
    alert("You lost! :(\nYour score was: " + level);
    timesClicked = -1;
    toggleColorClick(true);
    start.classList.remove("playing");
    start.innerHTML = "Start";
    setScore(level);
    displayHiscore();
    level = 0;
    putLevelNumber(0);
    sequence = [];
}

function putLevelNumber(n) {
    const level = document.querySelector(".level");
    level.innerText = `Level: ${n}`;
}

function toggleColorClick(state) {
    if (state) colors.forEach((c) => { c.classList.add("playing"); });
        
    else colors.forEach((c) => { c.classList.remove("playing"); });
}

function setScore(score) {
    let scoreStored = getScore();
    if (scoreStored > score) return;
    localStorage.setItem("hiscore", "" + score);
}

function getScore() {
    return parseInt(localStorage.getItem("hiscore")) || 0;
}

function displayHiscore() {
    const span = document.querySelector(".highscore");
    let scoreStored = getScore();

    span.innerHTML = "Highscore: " + scoreStored;
}

function starting() {
    start.classList.add("playing");
    start.innerHTML = "Playing...";
    putLevelNumber(1);
    displayHiscore();
    addNewColor();
    playAllSequence(0);
}

function toggleDarkMode() {
    const elements = ["body", ".color", ".level", ".dark-button", ".highscore"];
    elements.forEach((el) => {
        el = document.querySelectorAll(el);
        el.forEach((e) => {
            if (e.classList.contains("dark")) e.classList.remove("dark");
            else e.classList.add("dark");
        });
    });
}

// Dark mode Event Listener
document.querySelector(".dark-button").addEventListener("click", toggleDarkMode);

// Mute button Event Listener
document.querySelector(".mute-button").addEventListener("click", (e) => {
    e.target.innerText = e.target.innerText === "🔇" ? "🔈" : "🔇";
    muted = !muted;

});

// Start Event Listener
start.addEventListener("click", starting);

// Buttons Event Listener
colors.forEach((c) => {
    c.addEventListener("click", letPlayerClick);
});