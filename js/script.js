const board = document.querySelector(".board");
const blockheight = 80;
const blockwidth = 80;
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startgamemodal = document.querySelector(".start-game");
const gameovermodal = document.querySelector(".game-over");
const restartbutton = document.querySelector(".btn-restart");
const highscoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const cols = Math.floor(board.clientWidth / blockwidth);
const rows = Math.floor(board.clientHeight / blockheight);
const blocks = [];
let snakes = [{ x: 1, y: 2 }];
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
let direction = 'down';
let intervalid;
let timerIntervalId = null;

let highScore = localStorage.getItem("Highscore") || 0;
let score = 0;
let time = `00-00`;

highscoreElement.innerText = highScore;


for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.append(block);
        // block.textContent = `${i}-${j}`;
        blocks[`${i}-${j}`] = block;

    }
}
function render() {
    let head = null;
    blocks[`${food.x}-${food.y}`].classList.add("food");

    if (direction === 'left') {
        head = { x: snakes[0].x, y: snakes[0].y - 1 };
    }
    else if (direction === 'right') {
        head = { x: snakes[0].x, y: snakes[0].y + 1 };
    }
    else if (direction === 'down') {
        head = { x: snakes[0].x + 1, y: snakes[0].y };
    }
    else if (direction === 'up') {
        head = { x: snakes[0].x - 1, y: snakes[0].y };
    }

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalid);
        modal.style.display = "flex";
        startgamemodal.style.display = "none";
        gameovermodal.style.display = "flex";
        return;
    }

    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snakes.unshift(head);
        score += 10;
        scoreElement.innerText = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("Highscore", highScore.toString());
        }
    }

    snakes.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });

    snakes.unshift(head);
    snakes.pop();

    snakes.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });
}

// intervalid = setInterval(() => {
//     render();
// }, 400);

startButton.addEventListener("click", () => {
    modal.style.display = "none";

    intervalid = setInterval(() => {
        render();
    }, 300);

    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number);
        if (sec == 59) {
            min += 1;
            sec = 0;
        }
        else {
            sec++;
        }
        time = `${min}-${sec}`;
        timeElement.innerText = time;
    }, 1000);
});

restartbutton.addEventListener("click", restartgame);
function restartgame() {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snakes.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });
    score = 0;
    time = `00-00`;

    scoreElement.innerText = score;
    highscoreElement.innerText = highScore;
    timeElement.innerText = time;

    modal.style.display = "none";
    snakes = [{ x: 1, y: 2 }];
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
    direction = 'down';

    intervalid = setInterval(() => {
        render();
    }, 300);

}

addEventListener("keydown", (event) => {
    if (event.key == "ArrowUp") {
        direction = "up";
    }
    else if (event.key == "ArrowDown") {
        direction = "down";
    }
    else if (event.key == "ArrowRight") {
        direction = "right";
    }
    else if (event.key == "ArrowLeft") {
        direction = "left";
    }
})