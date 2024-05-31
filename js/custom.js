'use strict';

const words = ['DW', 'JavaScript', 'DOM', 'BOM', 'document', 'window', 'Event'];

const container = document.getElementById('container');
const input = document.getElementById('input');
const reaction = document.getElementById('reaction');
const hearts = document.querySelectorAll('.heart');
const scorePanel = document.querySelector('.score span');
const intro = document.getElementById('intro');
const result = document.getElementById('result');
const title = result.firstElementChild.firstElementChild;
const message = result.firstElementChild.firstElementChild.nextElementSibling;

let score = 0;
let count = 0;
let wrongCount = 0;
let missingCount = 0;
const maxWrongCount = 5;
let interval;

const maxPositionX = container.offsetWidth - 90;
const maxPositionY = container.offsetHeight - 100;

function init() {
  const extraWords = document.querySelectorAll('.word');
  extraWords.forEach((ex) => {
    ex.remove();
  });

  if (interval) {
    clearInterval(interval);
  }

  input.focus();

  score = 0;
  count = 0;
  wrongCount = 0;
  missingCount = 0;

  scorePanel.innerHTML = score;

  intro.style.display = 'none';
  result.style.display = 'none';

  words.forEach((word) => {
    const spanEl = document.createElement('span');

    spanEl.innerHTML = word;
    spanEl.classList.add('word');
    spanEl.setAttribute('id', word);

    spanEl.style.top = `${Math.floor(Math.random() * maxPositionY)}px`;
    spanEl.style.left = `${Math.floor(Math.random() * maxPositionX)}px`;

    container.append(spanEl);
  });

  hearts.forEach((heart) => {
    heart.classList.remove('broken');
  });

  wordRain();
}

function showResult(tit, msg) {
  title.innerHTML = tit;
  message.innerHTML = msg;
}

function wordRain() {
  const words = document.querySelectorAll('.word');

  interval = setInterval(function () {
    words.forEach((word) => {
      const rectSize = word.getBoundingClientRect();

      word.style.top = `${rectSize.top - 160}px`;

      let wordBottom = word.getBoundingClientRect().bottom;
      let containerBottom =
        container.getBoundingClientRect().bottom -
        parseInt(getComputedStyle(input).height.split('px')[0]);

      if (wordBottom >= containerBottom) {
        word.remove();
        missingCount++;
      }

      if (wrongCount < 5 && missingCount + count == words.length) {
        result.style.display = 'flex';

        score == 0
          ? showResult('Fail...', '왜 입력을 안하세요...😢😢')
          : showResult(
              'Clear!',
              `축하합니다!! 😎😊😋 <br />획득한 점수는 ${score}점 입니다.`
            );

        clearInterval(interval);
        return false;
      }

      if (wrongCount >= maxWrongCount) {
        result.style.display = 'flex';
        showResult('Fail...', '틀린 횟수가 초과되었습니다..😭😭😭');
        clearInterval(interval);
        return false;
      }
    });
  }, 1000);
}

input.addEventListener('change', function () {
  const word = document.querySelector(`span[id=${input.value}]`);

  if (word != null) {
    word.remove();
    count++;
    score += 100;
    scorePanel.innerHTML = score;
    reaction.innerHTML = 'Correct!';
    reaction.classList.add('fade');
  } else if (word == null) {
    wrongCount++;
    reaction.innerHTML = 'Wrong...';
    reaction.classList.add('fade');

    hearts[wrongCount - 1].classList.add('broken');

    input.value = '';
  }
  input.value = '';
});

reaction.addEventListener('animationend', function () {
  reaction.classList.remove('fade');
  reaction.innerHTML = '';
});
