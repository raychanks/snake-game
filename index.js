const canvas = document.querySelector('#port');
const modal = document.querySelector('#modal');
const button = document.querySelector('#restart');
const ctx = canvas.getContext('2d');

// 77px for the header and its margin
canvas.height = window.innerHeight - 77;
canvas.width = window.innerWidth;

const gridWidth = 5;
const boxSize = 30;
const stepSize = (boxSize + gridWidth);
let headLocation = {
  x: 200,
  y: 200,
};

// d - down, u - up, l - left, r - right
let linksFromHead = ['u', 'r', 'r', 'd', 'r'];
let foodLocation = {
  x: 480,
  y: 480,
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
    x: 200,
    y: 200,
  };
  linksFromHead = ['u', 'r', 'r', 'd', 'r'];
  foodLocation = {
    x: 480,
    y: 480,
  };
  currentDirection = 'r';
  intervalId = window.setInterval(updateCanvas, 500);
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

function checkCollide(linksFromHead) {
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

function updateCanvas() {
  linksFromHead.pop();
  linksFromHead.unshift(currentDirection);

  if (checkCollide(linksFromHead)) {
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

    // food
    ctx.fillStyle = 'crimson';
    ctx.fillRect(foodLocation.x, foodLocation.y, boxSize, boxSize);
  }
}

updateCanvas();

intervalId = window.setInterval(updateCanvas, 350);


