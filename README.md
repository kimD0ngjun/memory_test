<br />

<div align="center">
  <img width="50%" src="https://github.com/kimD0ngjun/memory_test/blob/main/assets/Logo.svg" alt="memoryTest">
</div>

<br />

## 프로젝트 개요

- **`프로젝트 명` :** **MEMORY TEST GAME**
- **`프로젝트 기간` :** 2023.12.24 ~ 2024.1.4
- **`진행 목적` :** 바닐라 자바스크립트 개념 숙지
- **`한줄 소개` :** 기억력 테스트 게임
- **`구현 영역` :** 프론트엔드
- **`배포 링크` :** <a href="https://memory-test-nine.vercel.app/" target="_blank">💡 MEMORY TEST</a>

---

## 기술 스택

### <span> 🖥 **Front-end** </span>
| Html | CSS | JavaScript |
| :---: | :---: | :---: |
| <img alt="Html" src ="https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" width="65" height="65" /> | <div style="display: flex; align-items: flex-start;"><img src="https://user-images.githubusercontent.com/111227745/210204643-4c3d065c-59ec-481d-ac13-cea795730835.png" alt="CSS" width="50" height="65" /></div> | <div style="display: flex; align-items: flex-start;"><img src="https://techstack-generator.vercel.app/js-icon.svg" alt="icon" width="85" height="85" /></div> |

---

## 프로젝트 소개

프론트엔드 공부를 하면서 대중적인 라이브러리(React, Styled-Component, Redux...)에 어느 정도 익숙해졌으나, 결국 그 근간은 프로그래밍 언어인 자바스크립트에서 시작되는 것이므로 해당 개념들을 회고하면서 이전에 했던 프로젝트를 리팩토링하면서 개념을 재숙지하고 접목하는 것이 프로젝트의 취지였다.

코드를 천천히 뜯어보면 많은 개념들이 내포되어 있지만, 가장 대표적으로 쓰였던 개념들은 ``DOM`` , ``비동기`` , ``호이스팅`` , ``재귀함수`` 였다.
<br /><br />
### 초기 화면

<div align="center">
  <img width="80%" src="https://github.com/kimD0ngjun/memory_test/blob/main/assets/README-Open.gif" alt="memoryTest">
</div>
<br />
접속하면 위와 같은 화면이 보인다. 병렬식으로 헤더와 메인, 푸터를 작성했으며 헤더의 설명 문구는 사용자마다 난잡하게 느껴질 가능성이 있어서 이전의 <a href="https://solarsystem-sable.vercel.app/" target="_blank">🌐 SOLAR SYSTEM</a> 프로젝트에서 사용했던 아이디어를 차용했다.
메인에 위치한 게임 프레임은 계산기에서 아이디어를 따왔다.<br />
<br />
사실 리액트로 프로젝트를 할 때는 스타일드 컴포넌트를 주로 사용해서 CSS 역시 함수처럼 다루며 자바스크립트와의 경계가 많이 흐려져 있었는데, 바닐라 JS로 수행한 작업이다보니 HTML에서 작성한 태그를 직접 도큐먼트 객체를 활용해서 하나하나 내용을 들고 온 다음, 이벤트를 장착시켜주는 작업의 반복이었다.
<br /><br />
여담으로 DOM은 프로그래밍 언어가 해당 문서에 접근하여 읽고 조작할 수 있도록 API를 제공하는 일종의 인터페이스이긴 하지만, 웹 브라우저 상에서 DOM을 다룰 수 있는 언어는 자바스크립트 밖에 없다. 물론 자바나 C# 같은 언어로도 충분히 구현은 가능하다만 웹 브라우저에서 다룰 수 있냐의 문제일 뿐.
<br /><br />

### 스테이지 진행

<div align="center">
  <img width="80%" src="https://github.com/kimD0ngjun/memory_test/blob/main/assets/README-Stage.gif" alt="memoryTest">
</div>
<br />
스테이지 진행의 큰 줄기를 차지하는 논리는 단계가 증가할 수록 외울 버튼의 수도 하나씩 증가한다는 것이었다. '게임 진행'을 하나의 함수로 생각하면, '단계'를 함수의 매개변수로 삼아서 '문제 출제' 기능을 수행할 수 있는 것이다. 그리고 조건문으로 클리어 하면 다음 단계로 넘어가고, 클리어 못 하면 게임을 종료시킨다.
<br /><br />
이걸 대략적인 코드로 나타내면 다음과 같다.
<br /><br />

```js
function 게임(스테이지) {
  // ...게임 문제 출제...
  if (게임을 클리어했나?) {
    다음 단계로
  } else {
    // ... 점수 정리 및 게임 마무리...
    return;
  }
}
```
<br />
가장 큰 핵심은 저 다음 단계를 넘어가는 것 역시 일종의 게임 진행이었고, 다만 매개변수가 1씩 늘어나서 다음 단계의 스테이지를 구현하는 것이었다. 나는 여기서 재귀함수를 써서 저 조건문의 참 조건을 인자를 1씩 더하여 재귀 조건으로, 거짓 조건을 탈출 조건으로 게임 종료를 구현하였다.
<br /><br />
그리고 게임 진행과 관련해서 버튼의 깜빡임이 프로세스 가이드 및 문제 난수 생성 출력의 핵심 기능이었기 때문에, 비동기를 사용하여 함수 작동 순서를 조정하면서 일정한 버튼의 깜빡임을 구현하였다. 다만 여기서 로직이 엄청 꼬이는 사태가 발생했는데, 바로 제한시간 기능 때문이었다. 게임의 클리어 여부와는 관계없이 제한시간 초과는 무조건 기회를 한 번 차감시켜야 돼서 문제와 정답 비교를 하는 함수의 작동과 겹치는 오류가 유발됐다.
<br /><br />
나는 이 문제를 아까 언급한 별개의 기능이라는 점에 주요해서 억지로 함수를 결합하는 것이 아닌, 정답 비교를 통한 오답 검출과 제한시간 초과를 별개로 나눠 작성했다.
<br /><br />

```js
function 정답() {
  // ...
  if (오답이 발생했는가?) {
    오답 관련 로직 처리
  }
  제한시간 초과 시 이뤄지는 로직 처리
}
```

<br />
다만 이렇게 작성해도 여전히 두 기능이 겹치는 문제가 발생했다. 핵심은 제한시간 초과와 문제 오답 검출은 별개이므로 제한시간 초과 역시 조건문으로 감싸줘야 둘 중에 하나만의 상황을 선택해서 진행시키는 것이었다. 그럼 제한시간 초과의 조건은 뭘까?<br /><br />
내 개인적인 결론은, 문제와 제한시간 초과까지의 정답 입력 길이가 다르다는 점과, 제한시간 출력 장치의 표시 숫자가 0이라는 점이 일반적인 오답과는 차별화되는 조건이었다. 이에 맞춰서 리팩토링을 진행하였다.<br />
<br />

```js
function 정답() {
  // ...
  if (오답이 발생했는가?) {
    오답 관련 로직 처리
  }
  if (문제 길이와 지금까지의 정답 길이가 다른가? && 시간이 0이 됐는가?) {
    제한시간 초과 시 이뤄지는 로직 처리
  }
}
```

<br />

### 스테이지 종료

<div align="center">
  <img width="80%" src="https://github.com/kimD0ngjun/memory_test/blob/main/assets/README-GameOver.gif" alt="memoryTest">
</div>
<br />
<div align="center">
  <img width="80%" src="https://github.com/kimD0ngjun/memory_test/blob/main/assets/README-ScoreRecord.gif" alt="memoryTest">
</div>
<br />
게임 오버가 되면 점수를 입력하고 스코어 보드에 기록을 남겨두는 게시판 기능을 추가했다. 이를 기반으로 추후 백엔드 부분까지 구현이 된다면 타인과의 기록을 비교하며 순위 랭킹을 나타내는 것 또한 가능할 것이다. 또한, 기록의 보존을 위해서 로컬스토리지에 점수 저장을 해뒀으며 사용자가 언제든지 삭제할 수 있도록 버튼도 함수로 구현했다.
<br /><br />
script.js 파일 하나에 모든 함수를 때려박아도 내가 생각한 순서대로 작동할 수 있는 건 자바스크립트에서의 함수는 호이스팅이 되기 때문에 소스 코드의 함수 호출 라인은 상관이 없었다는 점이 자바와는 다른 편리한 점이었다. 물론 변수는 호이스팅이 적용이 안 되므로 소스 코드 맨 윗줄에 작성하였다.

---

## 추후 리팩토링 고려사항

- ### 코드 정돈<br />
  파일 모듈화 등을 통해서 기능마다 파일을 별개로 두는 것을 고려 중이다. 다만, 모듈 파일은 소스 파일보다 로딩이 느려지기 때문에 비동기 동작이 많은 이번 프로젝트에서 고려를 신중히 해봐야 할 부분이다.
- ### window 객체가 아닌 모달, 자체 리플레이 기능 작성 및 활용<br />
  현재 프로젝트는 window 객체를 사용해서 점수 기록 및 리플레이 기능을 구현하고 있다. 이를 별도의 모달과 함수 내에서 재귀함수의 확장을 통한 리플레이 기능을 구현할 수 있을 것이다.
- ### 백엔드 과정( Node JS 혹은 Java 기반 )<br />
  앞서 언급했던 랭킹 시스템을 구현해서 타인과의 기록을 비교하는 것 또한 사용자 경험의 폭을 넓힐 수 있는 주요 기능이 될 수 있을 것이다.
- ### 반응형 디자인<br />
  개인적으로 가장 구현하기 까다롭다고 생각되는 게 반응형이다. 모바일 등의 화면에서도 내가 구현한 기능이 전부 담길 수 있도록 리팩토링하는 것 또한 고려사항 중 하나다.
