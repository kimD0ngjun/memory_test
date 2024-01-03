let memoryButton = document.getElementsByClassName("memoryButton");
const memoryArray = Array.from(memoryButton); // 유사배열객체 배열화

let playButton = document.getElementById("playButton");
let score = document.getElementById("scoreCount");
let scoreCount = 0;
let play = false;
let stage = 1;
let answerIndex = 0;
let click = true;
let wrongAnswer;

let life = document.getElementById("lifeCount");
let lifeCount = 3;

let limitTime = document.getElementById("timeCount");

let gameMessage = document.getElementById("gameMessage");

let questionArray = [];
let repeatArray = [];
let answerArray = [];

playButton.addEventListener("click", game);

async function game() {
  if (play) {
    resetGame();
  }
  play = !play;
  playButton.innerText = "REPLAY";
  await blinkGameProcess(blinkAllButton);
  await stagePlay(1);
}

async function stagePlay(stage) {
  await typeMessage(stage);
  await new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, 500)
  );
  await question(stage);
  countTime(stage);
  answer();
}

// 게임 진행 통지 관련 함수

async function blinkGameProcess(blinkFunction) {
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

// 진행 과정 관련 함수

async function resetGame() {
  let name;
  let guide = confirm(
    `
    Game Over

    최종 클리어 : ${stage === 1 ? `없음` : `${stage - 1} 단계`} 
    총합 스코어 : ${scoreCount} 점

    기록을 저장하시겠습니까?
    `
  );
  if (guide) {
    do {
      name = prompt("이름을 입력하세요 :");

      if (name === null) {
        alert("기록이 저장되지 않습니다. 게임을 초기화합니다");
        location.reload();
      }

      if (name.trim().length === 0) {
        alert("최소 1자 이상의 이름을 입력해주세요.");
      }
    } while (name.trim().length === 0);
    if (name !== null) {
      console.log(
        `
      이름 : ${name}
      날짜 : ${currentDate()}
      최종 클리어 : ${stage === 1 ? `없음` : `${stage - 1} 단계`}
      총합 스코어 : ${scoreCount} 점`
      );
      addScore(name, stage, scoreCount);
    }
    alert("게임을 초기화합니다");
  } else {
    alert("게임을 초기화합니다");
  }
  // location.reload();
}

function addScore(name, stage, scoreCount) {
  const scoreList = document.getElementById("scoreList");
  const scoreItem = document.createElement("li");
  scoreItem.id = "scoreItem";
  const scoreName = document.createElement("div");
  scoreName.innerText = `${name}`;
  scoreName.className = "scoreProperty";
  const scoreDate = document.createElement("div");
  scoreDate.innerText = `${currentDate()}`;
  scoreDate.className = "scoreProperty";
  const scoreStage = document.createElement("div");
  scoreStage.innerText = `${stage === 1 ? `없음` : `${stage - 1} 단계`}`;
  scoreStage.className = "scoreProperty";
  const scoreAmount = document.createElement("div");
  scoreAmount.innerText = `${scoreCount} 점`;
  scoreAmount.className = "scoreProperty";
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "🗑";

  deleteButton.addEventListener("click", function () {
    console.log("버튼 클릭");
    if (scoreList === deleteButton.parentElement) {
      scoreList.remove();
    }
  });

  scoreItem.appendChild(scoreName);
  scoreItem.appendChild(scoreDate);
  scoreItem.appendChild(scoreStage);
  scoreItem.appendChild(scoreAmount);
  scoreItem.appendChild(deleteButton);

  scoreList.appendChild(scoreItem);
}

function currentDate() {
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 1을 더하기
  let day = currentDate.getDate();

  // 월과 일이 한 자리 숫자인 경우 앞에 0을 붙여 두 자리로 만들기.
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  let formattedDate = year + "." + month + "." + day;
  return formattedDate;
}

async function countTime(stage) {
  console.log("시간 카운팅");
  let startTime = stage + 5;
  limitTime.innerText = startTime;

  await new Promise((resolve) => {
    let intervalId = setInterval(function () {
      if (
        parseInt(limitTime.innerText) === 0 ||
        compareArrays() ||
        JSON.stringify(questionArray) === JSON.stringify(answerArray)
      ) {
        clearInterval(intervalId);
        console.log("시간 멈춤");
        resolve(); // Promise를 해결하여 다음 단계로 진행
      } else {
        limitTime.innerText--;
      }
    }, 1000);
  });
}

function typeMessage(stage) {
  return new Promise((resolve) => {
    let stageMessage = `${stage} 단계 시작`;
    let index = 0;
    const typeNextCharacter = () => {
      if (index < stageMessage.length) {
        gameMessage.innerText += stageMessage[index];
        index++; // 타이핑 이펙트
        setTimeout(typeNextCharacter, 100);
      } else {
        resolve(); // 다 끝났으면 함수 종료
      }
    };
    typeNextCharacter();
  });
}

function deleteMessage() {
  return new Promise((resolve) => {
    const messageLength = gameMessage.innerText.length;
    let index = messageLength - 1;
    const deleteNextCharacter = () => {
      if (index >= 0) {
        gameMessage.innerText = gameMessage.innerText.slice(0, index);
        index--; // 딜리팅 이펙트
        setTimeout(deleteNextCharacter, 100);
      } else {
        resolve(); // 다 끝났으면 함수 종료
      }
    };
    deleteNextCharacter();
  });
}

// 스테이지 문제 제출 함수

async function question(stage) {
  click = false;
  wrongAnswer = false;
  for (let i = 0; i < stage; i++) {
    await blinkQuestion();
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  await new Promise((resolve) =>
    setTimeout(() => {
      click = true;
      console.log("질문 출제 확인");
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

async function answer() {
  console.log("정답 함수 작동");
  click = true;
  for (let i = 0; i < memoryArray.length; i++) {
    memoryArray[i].addEventListener("click", handleButtonClick);
    memoryArray[i].addEventListener("click", compareArrays);
  }
  setTimeout(async () => {
    if (
      limitTime.innerText === "0" &&
      answerArray.length !== questionArray.length
    ) {
      console.log("제한시간 초과");
      lifeCount--;
      click = false;
      if (lifeCount === 0) {
        life.innerText = " ";
      }
      life.innerText = "❤️".repeat(lifeCount);
      await blinkGameProcess(blinkFail);

      if (lifeCount === 0) {
        resetGame();
      }

      await new Promise((resolve) => setTimeout(resolve, 150));
      answerArray = [];
      await repeatQuestion();
      limitTime.innerText = `${questionArray.length + 5}`;
      rightAnswer = false;
      correctAnswer = false;
      answerIndex = 0;
      countTime(stage);
      answer();
      return;
    }
  }, stage * 1000 + 5000);
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

// 실시간 정답 검증을 위한 배열 비교
function compareArrays() {
  for (let i = 0; i < answerArray.length; i++) {
    if (answerArray[i] !== questionArray[i]) {
      wrongAnswer = true;
      console.log("오답검증 : " + wrongAnswer);
      return wrongAnswer;
    }
  }
  if (parseInt(limitTime.innerText) === 0) {
    wrongAnswer = true;
    console.log("오답검증 : " + wrongAnswer);
    return wrongAnswer;
  }
}

async function checkAnswer() {
  console.log("정답 검증 작동");
  if (answerIndex < questionArray.length) {
    if (compareArrays()) {
      lifeCount--;
      click = false;
      if (lifeCount === 0) {
        life.innerText = " ";
      }
      life.innerText = "❤️".repeat(lifeCount);
      await blinkGameProcess(blinkFail);

      if (lifeCount === 0) {
        resetGame();
      }

      await new Promise((resolve) => setTimeout(resolve, 150));
      answerArray = [];
      await repeatQuestion();
      limitTime.innerText = `${questionArray.length + 5}`;
      rightAnswer = false;
      correctAnswer = false;
      answerIndex = 0;
      countTime(stage);
      answer();
      return;
    }

    answerIndex++;
  }

  if (answerIndex === questionArray.length) {
    if (JSON.stringify(questionArray) === JSON.stringify(answerArray)) {
      questionArray = [];
      repeatArray = [];
      answerArray = [];
      let timeGap = parseInt(limitTime.innerText);
      console.log("클리어 시간 차 : " + timeGap);
      scoreCount += 15 * timeGap;
      score.innerText = String(scoreCount).padStart(5, "0");

      console.log("점수 : " + score.innerText);
      deleteMessage();
      await blinkGameProcess(blinkSuccess);

      rightAnswer = false;
      correctAnswer = false;
      answerIndex = 0;
      stage++;
      stagePlay(stage);
    }
  }
}
