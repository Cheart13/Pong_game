const canvas= document.getElementById('canvas');
const ctx = canvas.getContext('2d');


function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

var x = canvas.width/2;
var y = canvas.height-30;

var dx = 2;
var dy = -2;

var ballRadius = 10;

let platformLength = 50;
let platformX = canvas.width/2 - platformLength/2;
let platformY=390;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 6;
var brickWidth = 50;
var brickHeight = 20;
var brickPadding = 5;
var brickOffsetTop = 30;
var brickOffsetLeft = 40;

var score = 0;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}


function drawWinMess() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("You Won! Congratulations.", 25, 190);
}

function drawLoseMess() {
    ctx.font = "26px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Game over", 140, 190);
}

function drawScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: "+score, 8, 20);
}

function collisionDetection() {
	for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x+ballRadius > b.x && x < b.x+brickWidth && y
					+ballRadius > b.y && y-ballRadius < b.y+brickHeight) {
                    dy = -dy;
					//changeDX();
                    b.status = 0;
					score++;
                }
            }
        }
    }
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "red";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drowPlatform(){
	ctx.beginPath();
	ctx.rect(platformX, platformY, platformLength, 10);
	ctx.fillStyle = "Black";
	ctx.fill();
	ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "lightgrey";
    ctx.fill();
    ctx.closePath();
}

function changeDX(){
	if(dx>0){dx= Math.round(Math.random()*3);dx++;}
	if(dx<0){dx= - Math.round(Math.random()*3); dx--;}
	
	
	
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
	drowPlatform();
	drawBricks();
	collisionDetection();
	drawScore();
	if(x + ballRadius + dx > canvas.width || x - ballRadius + dx < 0) { 
		dx = -dx;
		
	}
	
	if(y + dy < ballRadius) {
        dy = -dy;
    }else
	if(y + dy + ballRadius >= platformY && x >= platformX && x < platformX + platformLength) {
            dy = -dy;
			changeDX();
    }
    else if(y + dy>= canvas.height){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLoseMess();
		clearInterval(interval);
        setTimeout( function (){
			document.location.reload();
		},10000);
    }
    
    x += dx;
    y += dy;

	if(rightPressed) {
		platformX += 3;
		if (platformX + platformLength > canvas.width){
			platformX = canvas.width - platformLength;
		}
	}
	else if(leftPressed) {
		platformX -= 3;
		if (platformX < 0){
			platformX = 0;
		}
	}

	if(score == brickRowCount*brickColumnCount) {
        drawWinMess();
		clearInterval(interval);
        setTimeout( function (){
			document.location.reload();
		},10000);
	}
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
var interval = setInterval(draw, 1000/60);
