const canvas = document.querySelector('#port');
const ctx = canvas.getContext('2d');

// 77px for the header and its margin
canvas.height = window.innerHeight - 77;
canvas.width = window.innerWidth;

const gridWidth = 5;
const boxSize = 30;
const headLocation = {
  x: 200,
  y: 200,
};

// d - down, u - up, l - left, r - right
const linksFromHead = ['d', 'l', 'l', 'u', 'l'];
const foodLocation = {
  x: 480,
  y: 480,
};

ctx.beginPath();

// snake head
ctx.fillStyle = 'steelblue';
ctx.fillRect(headLocation.x, headLocation.y, boxSize, boxSize);

// snake body
const stepSize = (boxSize + gridWidth);
let { x: bodyX, y: bodyY } = headLocation;

ctx.fillStyle = 'cadetblue';

linksFromHead.forEach(direction => {
  switch (direction) {
  case 'l':
    bodyX -= stepSize;
    break;

  case 'r':
    bodyX += stepSize;
    break;

  case 'u':
    bodyY -= stepSize;
    break;

  case 'd':
    bodyY += stepSize;
    break;

  default:
    throw new Error('Invalid data type');
  }

  ctx.fillRect(bodyX, bodyY, boxSize, boxSize);
});

// food
ctx.fillStyle = 'crimson';
ctx.fillRect(foodLocation.x, foodLocation.y, boxSize, boxSize);

console.log(headLocation)