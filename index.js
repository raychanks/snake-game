const canvas = document.querySelector('#port');
const modal = document.querySelector('#modal');
const button = document.querySelector('#restart');
const scoreSpan = document.querySelector('.score');
const ctx = canvas.getContext('2d');

const gridWidth = 5;
const boxSize = 30;
const stepSize = (boxSize + gridWidth);
const refreshInterval = 150;
const headerHeight = 77;
const lengthAdditionForFood = 5;
const scoreFactorArr = [5, 8, 13, 20, 30, 45, 60, 80, 100];
const lengthArr = [20, 40, 70, 100, 130, 160, 200, 250];

// 77px for the header and its margin
canvas.height =
  window.innerHeight
  - headerHeight
  - (window.innerHeight - headerHeight) % stepSize
  - gridWidth;
canvas.width =
  window.innerWidth
  - window.innerWidth % stepSize
  - gridWidth;

const maxColumns = Math.floor(canvas.width / stepSize);
const maxRows = Math.floor(canvas.height / stepSize);
const startX = 70;
const startY = 70;
let headLocation = {
  x: startX,
  y: startY,
};

// d - down, u - up, l - left, r - right
// index 0: point from the first body block to the head
// index 1: point from the second body block to the first body block
// and etc
let links = ['u'];
let foodLocation = {
  x: 210,
  y: 140,
};
let currentDirection = 'r';
let addLengthCount = 0;
let score = 0;
let scoreLevel = 0;
let intervalId;

// listeners for keyboard inputs
window.addEventListener('keydown', event => {
  const keyObj = {
    ArrowUp: 'u',
    ArrowDown: 'd',
    ArrowLeft: 'l',
    ArrowRight: 'r',
  };
  const oppositeDir = {
    u: 'd',
    d: 'u',
    l: 'r',
    r: 'l',
  };
  const newDir = keyObj[event.key];

  // ignore direction change if it goes backwards towords to body
  if (newDir && oppositeDir[newDir] !== links[0]) {
    currentDirection = newDir;
  }
});

button.addEventListener('click', function () {
  headLocation = {
    x: startX,
    y: startY,
  };
  links = ['u'];
  foodLocation = {
    x: 210,
    y: 140,
  };
  currentDirection = 'r';
  intervalId = window.setInterval(updateCanvas, refreshInterval);
  modal.style.display = 'none';
  updateCanvas();
});

function drawSnake() {
  ctx.beginPath();

  // snake head
  ctx.fillStyle = 'steelblue';
  ctx.fillRect(headLocation.x, headLocation.y, boxSize, boxSize);

  // snake body
  let { x: bodyX, y: bodyY } = headLocation;

  ctx.fillStyle = 'cadetblue';

  links.forEach(direction => {
    switch (direction) {
    case 'r':
      bodyX -= stepSize;
      break;

    case 'l':
      bodyX += stepSize;
      break;

    case 'd':
      bodyY -= stepSize;
      break;

    case 'u':
      bodyY += stepSize;
      break;

    default:
      throw new Error('Invalid data type');
    }

    ctx.fillRect(bodyX, bodyY, boxSize, boxSize);
  });
}

function checkCollision(links, headLocation, currentDirection) {
  // check for collision with bounds
  if (
    headLocation.x === 0 && currentDirection === 'l'
  || headLocation.x + stepSize > canvas.width && currentDirection === 'r'
  || headLocation.y === 0 && currentDirection === 'u'
  || headLocation.y + stepSize > canvas.height && currentDirection === 'd'
  ) {
    return true;
  }

  // check for self-collision
  const directionObj = {
    right: 0,
    down: 0,
  };

  for (let direction of links) {
    switch (direction) {
    case 'r':
      directionObj.right++;
      break;

    case 'l':
      directionObj.right--;
      break;

    case 'd':
      directionObj.down++;
      break;

    case 'u':
      directionObj.down--;
      break;

    default:
      throw new Error('Invalid data type');
    }

    // forms a loop, which implies the snake collide with itself
    if (directionObj.right === 0 && directionObj.down === 0) {
      return true;
    }
  }

  return false;
}

function snakeFood(headLocation, foodLocation, links) {
  const occupied = [headLocation];
  let refX;
  let refY;

  links.forEach(direction => {
    refX = occupied[occupied.length - 1].x;
    refY = occupied[occupied.length - 1].y;

    switch (direction) {
    case 'r':
      refX -= stepSize;
      break;

    case 'l':
      refX += stepSize;
      break;

    case 'd':
      refY -= stepSize;
      break;

    case 'u':
      refY += stepSize;
      break;

    default:
      throw new Error('Invalid data type');
    }

    occupied.push({ x: refX, y: refY });
  });

  const newX = startX % stepSize + Math.floor(Math.random() * maxColumns) * stepSize;
  const newY = startX % stepSize + Math.floor(Math.random() * maxRows) * stepSize;

  if (headLocation.x === foodLocation.x
    && headLocation.y === foodLocation.y) {
    let newX = startX % stepSize + Math.floor(Math.random() * maxColumns) * stepSize;
    let newY = startX % stepSize + Math.floor(Math.random() * maxRows) * stepSize;

    while (occupied.some(loc => loc.x === newX && loc.y === newY)) {
      newX = startX % stepSize + Math.floor(Math.random() * maxColumns) * stepSize;
      newY = startX % stepSize + Math.floor(Math.random() * maxRows) * stepSize;
    }

    addLengthCount += lengthAdditionForFood;
    foodLocation.x = newX;
    foodLocation.y = newY;
  }

  ctx.fillStyle = 'crimson';
  ctx.fillRect(foodLocation.x, foodLocation.y, boxSize, boxSize);
}

function updateCanvas() {
  if (addLengthCount !== 0) {
    links.unshift(currentDirection);

    // increase score increment if certain length is met
    if (lengthArr.includes(links.length)) {
      scoreLevel++;
    }

    score += scoreFactorArr[scoreLevel];
    scoreSpan.textContent = score;
    addLengthCount--;
  } else {
    links.pop();
    links.unshift(currentDirection);
  }

  if (checkCollision(links, headLocation, currentDirection)) {
    window.clearInterval(intervalId);
    modal.style.display = 'flex';
  } else {
    switch (currentDirection) {
    case 'r':
      headLocation.x += stepSize;
      break;

    case 'l':
      headLocation.x -= stepSize;
      break;

    case 'd':
      headLocation.y += stepSize;
      break;

    case 'u':
      headLocation.y -= stepSize;
      break;

    default:
      throw new Error('Invalid data type');
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    snakeFood(headLocation, foodLocation, links);
  }
}

updateCanvas();

intervalId = window.setInterval(updateCanvas, refreshInterval);
