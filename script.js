let memoryButton = document.getElementsByClassName("memoryButton");
const memoryArray = Array.from(memoryButton); // 유사배열객체 배열화

console.log(memoryArray);

let playButton = document.getElementById("playButton");

let stageSequence = [];
let index = 0;
let stage = 1;

playButton.addEventListener("click", game);

function game() {
  allBlink();
}

function allBlink() {
  return new Promise((resolve) => {
    console.log("반짝");

    memoryArray.map((el) => el.classList.add(`message`));
    setTimeout(() => {
      memoryArray.map((el) => el.classList.remove(`message`));
      resolve();
    }, 500);
  });
}
