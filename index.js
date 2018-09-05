const canvas = document.querySelector('#port');
const modal = document.querySelector('#modal');
const button = document.querySelector('#restart');
const ctx = canvas.getContext('2d');

const gridWidth = 5;
const boxSize = 30;
const stepSize = (boxSize + gridWidth);
const refreshInterval = 250;

// 77px for the header and its margin
canvas.height = window.innerHeight - 77 - (window.innerHeight - 77) % stepSize - gridWidth;
canvas.width = window.innerWidth - window.innerWidth % stepSize - gridWidth;

const maxColumns = Math.floor(canvas.width / stepSize);
const maxRows = Math.floor(canvas.height / stepSize);
const startX = 70;
const startY = 70;
let headLocation = {
  x: startX,
  y: startY,
};

// d - down, u - up, l - left, r - right
let linksFromHead = ['u', 'r', 'r', 'd', 'r'];
let foodLocation = {
  x: 210,
  y: 140,
};
let currentDirection = 'r';
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
  if (newDir && oppositeDir[newDir] !== linksFromHead[0]) {
    currentDirection = newDir;
  }
});

button.addEventListener('click', function () {
  headLocation = {
    x: startX,
    y: startY,
  };
  linksFromHead = ['u', 'r', 'r', 'd', 'r'];
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

  linksFromHead.forEach(direction => {
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

function checkCollide(linksFromHead, headLocation, currentDirection) {
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

  for (let direction of linksFromHead) {
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

function snakeFood(headLocation, foodLocation, linksFromHead) {
  const occupied = [headLocation];
  let refX;
  let refY;

  linksFromHead.forEach(direction => {
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

    foodLocation.x = newX;
    foodLocation.y = newY;
  }

  ctx.fillStyle = 'crimson';
  ctx.fillRect(foodLocation.x, foodLocation.y, boxSize, boxSize);
}

function updateCanvas() {
  linksFromHead.pop();
  linksFromHead.unshift(currentDirection);

  if (checkCollide(linksFromHead, headLocation, currentDirection)) {
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
    snakeFood(headLocation, foodLocation, linksFromHead);
  }
}

updateCanvas();

intervalId = window.setInterval(updateCanvas, refreshInterval);
