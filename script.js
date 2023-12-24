let memoryButton = document.getElementsByClassName("memoryButton");
const memoryArray = Array.from(memoryButton); // 유사배열객체 배열화

let playButton = document.getElementById("playButton");
let stage = 1;
let answerIndex = 0;
let click = true;

let questionArray = [];
let repeatArray = [];
let answerArray = [];

playButton.addEventListener("click", game);

async function game() {
  await stagePlay(3);
}

async function stagePlay(stage) {
  await question(stage);
  answer();
}

// 게임 진행 통지 관련 함수

async function noticeGameMessage(blinkFunction) {
  const delays = [300, 500, 500];
  click = false;

  for (let i = 0; i < 3; i++) {
    await new Promise((resolve) => setTimeout(resolve, delays[i]));
    await blinkFunction();
  }
  await new Promise((resolve) =>
    setTimeout(() => {
      click = true;
      console.log(click);
      resolve();
    }, 1300)
  ); // 이 부분은 실패 시 문제내용 재 제시, 성공 시 다음 단계 문제 제시 로직 추가하면 삭제할 것
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
  click = false;
  for (let i = 0; i < stage; i++) {
    await blinkQuestion();
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  await new Promise((resolve) =>
    setTimeout(() => {
      click = true;
      console.log(click);
      resolve();
    }, stage * 150)
  );
}

async function repeatQuestion() {
  click = false;
  for (let i = 0; i < repeatArray.length; i++) {
    repeatArray[i].classList.add("message");
    await new Promise((resolve) => {
      setTimeout(() => {
        repeatArray[i].classList.remove("message");
        resolve();
      }, 500);
    });
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  await new Promise((resolve) =>
    setTimeout(() => {
      click = true;
      console.log(click);
      resolve();
    }, repeatArray.length * 150)
  );
}

function blinkQuestion() {
  return new Promise((resolve) => {
    let randomIndex = Math.floor(Math.random() * memoryButton.length);
    const randomButton = memoryArray[randomIndex];

    questionArray.push(Number(randomButton.id));
    repeatArray.push(randomButton);
    console.log(questionArray);

    randomButton.classList.add("message");
    setTimeout(() => {
      randomButton.classList.remove("message");
      resolve(randomButton); // 반환값 지정
    }, 650);
  });
}

// 스테이지 정답 제출 함수

function answer() {
  click = true;
  for (let i = 0; i < memoryArray.length; i++) {
    memoryArray[i].addEventListener("click", handleButtonClick);
  }
}

function handleButtonClick(event) {
  if (click) {
    const clickedButtonId = Number(event.target.id);
    answerArray.push(clickedButtonId);

    console.log("Clicked button ID:", clickedButtonId);
    console.log(answerArray);

    checkAnswer();
  }
}

async function checkAnswer() {
  if (answerIndex < questionArray.length) {
    if (answerArray[answerIndex] !== questionArray[answerIndex]) {
      await noticeGameMessage(blinkFail);
      await repeatQuestion();
      answerArray = [];
      answerIndex = 0;
      return;
    }

    answerIndex++;
  }

  if (answerIndex === questionArray.length) {
    let isCorrect = true;

    for (let i = 0; i < answerArray.length; i++) {
      if (answerArray[i] !== questionArray[i]) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
      noticeGameMessage(blinkSuccess);
      questionArray = [];
      repeatArray = [];
      answerArray = [];
      answerIndex = 0;
      return;
    }
  }
}
