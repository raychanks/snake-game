const canvas = document.querySelector('#port');
const ctx = canvas.getContext('2d');

// 77px for the header and its margin
canvas.height = window.innerHeight - 77;
canvas.width = window.innerWidth;

ctx.beginPath();
ctx.fillStyle = 'palevioletred';
ctx.fillRect(200, 200, 20, 20);
ctx.fillRect(225, 225, 20, 20);
ctx.fillRect(200, 225, 20, 20);
ctx.fillRect(225, 200, 20, 20);
