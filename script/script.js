// SETT
let isHolding = {
    d: false,
    f: false,
    j: false,
    k: false,
};

let hits = {
    PERFECT: 0,
    GOOD: 0,
    BAD: 0,
    MISS: 0,
};

let grade = {
    PERFECT: 1,
    GOOD: 0.5,
    BAD: 0.2,
    MISS: 0,
    combo25: 1.5,
    combo50: 2,
};

let isPlaying = false;
let animation = "moveDown";
let username = "";

let score = 0;
let speed = 0;
let combo = 0;
let maxCombo = 0;
let comboText;

let trackContainer;
let tracks;
let startTime;
let keypress;

// SETUP__FN
let setupSpeed = () => {
    let buttons = document.querySelectorAll(".speed-item");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.innerHTML === "1x") {
                buttons[0].className = "speed-item speed-item-selected";
                buttons[1].className = "speed-item";
                buttons[2].className = "speed-item";

                speed = parseInt(button.innerHTML) - 1;
            } else if (button.innerHTML === "2x") {
                buttons[0].className = "speed-item";
                buttons[1].className = "speed-item speed-item-selected";
                buttons[2].className = "speed-item";

                speed = parseInt(button.innerHTML) - 1;
            } else if (button.innerHTML === "3x") {
                buttons[0].className = "speed-item";
                buttons[1].className = "speed-item";
                buttons[2].className = "speed-item speed-item-selected";

                speed = parseInt(button.innerHTML) - 1;
            }

            setupNotes();
        });
    });
};

let setupHits = (index) => {
    let timeInSecond = (Date.now() - startTime) / 1000;
    let nextNoteIndex = song.sheet[index].next;
    let nextNote = song.sheet[index].notes[nextNoteIndex];
    let perfectTime = nextNote.duration + nextNote.delay;
    let accuracy = Math.abs(timeInSecond - perfectTime);

    if (accuracy > (nextNote.duration - speed) / 4) {
        return;
    }

    let hitJudgement = setupHitJudgement(accuracy);

    updateNext(index);
    updateScore(hitJudgement);
    updateHits(hitJudgement);
    updateCombo(hitJudgement);
    updateMaxCombo();

    displayAccuracy(hitJudgement);
    displayRemoveNote(tracks[index], tracks[index].firstChild);
};

let setupHitJudgement = (accuracy) => {
    if (accuracy < 0.4) {
        return "PERFECT";
    } else if (accuracy < 0.6) {
        return "GOOD";
    } else if (accuracy < 1) {
        return "BAD";
    } else {
        return "MISS";
    }
};

let setupKeys = () => {
    document.addEventListener("keydown", (event) => {
        let keyIndex = setupKeyIndex(event.key);

        if (Object.keys(isHolding).indexOf(event.key) !== -1 && !isHolding[event.key]) {
            isHolding[event.key] = true;
            keypress[keyIndex].style.display = "block";

            if (isPlaying && tracks[keyIndex].firstChild) {
                setupHits(keyIndex);
            }
        }
    });

    document.addEventListener("keyup", (event) => {
        if (Object.keys(isHolding).indexOf(event.key) !== -1) {
            let keyIndex = setupKeyIndex(event.key);

            isHolding[event.key] = false;
            keypress[keyIndex].style.display = "none";
        }
    });
};

let setupKeyIndex = (key) => {
    if (key === "d") {
        return 0;
    } else if (key === "f") {
        return 1;
    } else if (key === "j") {
        return 2;
    } else if (key === "k") {
        return 3;
    }
};

let setupNotes = () => {
    let noteElement;
    let trackElement;

    while (trackContainer.hasChildNodes()) {
        trackContainer.removeChild(trackContainer.lastChild);
    }

    song.sheet.forEach((key, index) => {
        trackElement = document.createElement("div");
        trackElement.classList.add("track");

        key.notes.forEach((note) => {
            noteElement = document.createElement("div");
            noteElement.classList.add("note");
            noteElement.classList.add("note--" + index);
            noteElement.style.animationName = animation;
            noteElement.style.animationTimingFunction = "linear";
            noteElement.style.animationDuration = note.duration - speed + "s";
            noteElement.style.animationDelay = note.delay + speed + "s";
            noteElement.style.animationPlayState = "paused";
            trackElement.appendChild(noteElement);
        });

        trackContainer.appendChild(trackElement);
        tracks = document.querySelectorAll(".track");
    });
};

let setupNoteMiss = () => {
    trackContainer.addEventListener("animationend", (event) => {
        let index = event.target.classList.item(1)[6];

        updateNext(index);
        updateHits("MISS");
        updateCombo("MISS");
        updateMaxCombo();

        displayAccuracy("MISS");
        displayRemoveNote(event.target.parentNode, event.target);
    });
};

// UPDATE__FN
let updateNext = (index) => {
    song.sheet[index].next++;
};

let updateScore = (judgement) => {
    if (combo >= 25) {
        score += 1000 * grade[judgement] * grade.combo25;
    } else if (combo >= 50) {
        score += 1000 * grade[judgement] * grade.combo50;
    } else {
        score += 1000 * grade[judgement];
    }
};

let updateHits = (judgement) => {
    hits[judgement]++;
};

let updateCombo = (judgement) => {
    if (judgement === "BAD" || judgement === "MISS") {
        combo = 0;
        comboText.innerHTML = "";
    } else {
        comboText.innerHTML = ++combo;
    }
};

let updateMaxCombo = (judgement) => {
    maxCombo = maxCombo > combo ? maxCombo : combo;
};

// DISPLAY__FN
let displayAccuracy = (accuracy) => {
    let accuracyText = document.createElement('div');
    document.querySelector('.hit-accuracy').remove();

    accuracyText.classList.add('hit-accuracy');
    accuracyText.classList.add(accuracy);
    accuracyText.innerHTML = accuracy;

    document.querySelector('.hit-container').appendChild(accuracyText);
};

let displayResult = () => {
    document.getElementById("username-result-board").innerHTML =
        "USERNAME: " + username;
    document.querySelector(".PERFECT").innerHTML = "PERFECT: " + hits.PERFECT;
    document.querySelector(".GOOD").innerHTML = "GOOD: " + hits.GOOD;
    document.querySelector(".BAD").innerHTML = "BAD: " + hits.BAD;
    document.querySelector(".MISS").innerHTML = "MISS: " + hits.MISS;
    document.getElementById("score-result").innerHTML = "SCORE: " + score;
    document.getElementById("play-again").addEventListener("click", () => {
        window.location.href = "./index.html";
    });

    document.querySelector(".in-game-board").style.opacity = 0;
    document.querySelector(".result-board").style.opacity = 1;
};

let displayRemoveNote = (parent, child) => {
    parent.removeChild(child);
};

// START__FN
let startGame = () => {
    document.getElementById("play-btn").addEventListener("click", () => {
        username = document.getElementById("username").value;

        if (username != "") {
            document.getElementById("home-screen").style.display = "none";
            document.getElementById("game-screen").style.display = "unset";

            isPlaying = true;
            startTime = Date.now();
            startTimer(song.duration);

            document.querySelectorAll(".note").forEach((note) => {
                note.style.animationPlayState = "running";
            });
        } else {
            alert("You havent entry username player");
        }
    });
};

let startTimer = (duration) => {
    let timerDisplay = document.getElementById("timer");
    let scoreDisplay = document.getElementById("score");
    let failDisplay = document.getElementById("fail");
    let usernameDisplay = document.getElementById("username-result");
    let minutes;
    let timer = duration;
    let seconds;

    let songIntervalDuration = setInterval(() => {
        minutes = Math.floor(timer / 60);
        seconds = timer % 60;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerDisplay.innerHTML = "Time: " + minutes + ":" + seconds;
        scoreDisplay.innerHTML = "Score: " + score;
        failDisplay.innerHTML = "Fail: " + hits.MISS;
        usernameDisplay.innerHTML = "Player: " + username;

        if (--timer < 0) {
            clearInterval(songIntervalDuration);
            displayResult();
            comboText.style.opacity = 0;
        }
    }, 1000);
};

// ONLOAD
window.onload = () => {
    trackContainer = document.querySelector(".track-container");
    keypress = document.querySelectorAll(".keypress");
    comboText = document.querySelector(".hit-combo");

    let aboutDialog = document.getElementById("about-section");
    let instructionDialog = document.getElementById("instruction-section");

    document.getElementById("about").addEventListener("click", () => {
        aboutDialog.style.display = "flex";
    });

    document.getElementById("close-about").addEventListener("click", () => {
        aboutDialog.style.display = "none";
    });

    document.getElementById("instruction").addEventListener("click", () => {
        instructionDialog.style.display = "flex";
    });

    document
        .getElementById("close-instruction")
        .addEventListener("click", () => {
            instructionDialog.style.display = "none";
        });

    setupSpeed();
    setupKeys();
    setupNotes();
    setupNoteMiss();
    startGame();
};
