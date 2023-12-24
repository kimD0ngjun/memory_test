let memoryButton = document.getElementsByClassName("memoryButton");
const memoryArray = Array.from(memoryButton); // 유사배열객체 배열화

let playButton = document.getElementById("playButton");
let stage = 1;
let sequenceIndex = 0;

const questionArray = [];
const answerArray = [];

playButton.addEventListener("click", game);

async function game() {
  //   await noticeGameMessage(blinkAllButton);

  await question(2);
  // await answer();
}

// 게임 진행 통지 관련 함수

async function noticeGameMessage(blinkFunction) {
  const delays = [300, 500, 500];

  for (let i = 0; i < 3; i++) {
    await new Promise((resolve) => setTimeout(resolve, delays[i]));
    await blinkFunction();
  }
}

function blinkAllButton() {
  return new Promise((resolve) => {
    memoryArray.map((el) => el.classList.add(`message`));
    setTimeout(() => {
      memoryArray.map((el) => el.classList.remove(`message`));
      resolve();
    }, 500);
  });
}

function blinkSuccess() {
  return new Promise((resolve) => {
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

function blinkFail() {
  return new Promise((resolve) => {
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

// 스테이지 문제 제출 함수

async function question(stage) {
  for (let i = 0; i < stage; i++) {
    await blinkQuestion();
  }
}

function blinkQuestion() {
  return new Promise((resolve) => {
    let randomIndex = Math.floor(Math.random() * memoryButton.length);
    const randomButton = memoryArray[randomIndex];

    questionArray.push(Number(randomButton.id));
    console.log(questionArray);

    randomButton.classList.add("message");
    setTimeout(() => {
      randomButton.classList.remove("message");
      resolve(randomButton); // 반환값 지정
    }, 650);
  });
}

// 스테이지 정답 제출 함수

async function answer() {
  for (let i = 0; i < memoryArray.length; i++) {
    memoryArray[i].addEventListener("click", (event) =>
      handleUserButton(event, questionArray, i)
    );
  }
}

function handleUserButton(event, randomButton, sequenceIndex) {
  const userClickButton = event.target;
  console.log(userClickButton);
  console.log(randomButton);

  if (Number(userClickButton.id) !== randomButton[sequenceIndex]) {
    console.log("실패");
    noticeGameMessage(blinkFail);
  }
}

function handleButtonClick(clickedButtonId) {
  const buttonNumber = Number(clickedButtonId);
  answerArray.push(buttonNumber);

  console.log("Clicked button ID:", buttonNumber);
  console.log(answerArray);

  checkAnswer();
}

function checkAnswer() {
  if (sequenceIndex < questionArray.length) {
    if (answerArray[sequenceIndex] !== questionArray[sequenceIndex]) {
      noticeGameMessage(blinkFail);
      console.log("실패");
    }

    sequenceIndex++;
  }
}
