let memoryButton = document.getElementsByClassName("memoryButton");
const memoryArray = Array.from(memoryButton); // 유사배열객체 배열화

console.log(memoryArray);

let playButton = document.getElementById("playButton");
let stage = 1;

const stageArray = [];
const userArray = [];

playButton.addEventListener("click", game);

async function game() {
  await noticeGameMessage(allBlink);
  await noticeGameMessage(successBlink);
  await noticeGameMessage(failBlink);
}

// 게임 진행 통지 관련 함수

async function noticeGameMessage(blinkFunction) {
  const delays = [300, 500, 500];

  for (let i = 0; i < 3; i++) {
    await new Promise((resolve) => setTimeout(resolve, delays[i]));
    await blinkFunction();
  }
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

function successBlink() {
  return new Promise((resolve) => {
    console.log("성공 반짝");

    memoryArray.map((el) =>
      (Number(el.id) > 1 && Number(el.id) < 5) ||
      (Number(el.id) > 21 && Number(el.id) < 25) ||
      (Number(el.id) % 5 === 1 &&
        Number(el.id) !== 1 &&
        Number(el.id) !== 21) ||
      (Number(el.id) % 5 === 0 && Number(el.id) !== 5 && Number(el.id) !== 25)
        ? el.classList.add(`success`)
        : el
    );
    setTimeout(() => {
      memoryArray.map((el) => el.classList.remove(`success`));
      resolve();
    }, 500);
  });
}

function failBlink() {
  return new Promise((resolve) => {
    console.log("실패 반짝");
    memoryArray.map((el) =>
      Number(el.id) % 6 === 1 || Number(el.id) % 4 === 1
        ? el.classList.add(`fail`)
        : el
    );
    setTimeout(() => {
      memoryArray.map((el) => el.classList.remove(`fail`));
      resolve();
    }, 500);
  });
}
