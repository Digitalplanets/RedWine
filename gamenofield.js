var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var out = document.getElementById("out");
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//set initial ball location
var x = canvas.width/2;
var y = canvas.height/2;

//set ball radius
var ballRadius = 6;

//set ball speed
var dx = 3;
var dy = -3;

//initialize ball speed
var m = 0;
var j = 0;

var aiSpeed = 1.25;

//set paddle dimensions
var paddleHeight = 10;
var paddleWidth = 30;

var paddleX = (canvas.width-paddleWidth);

//initialize keypress status
var rightPressed = false;
var leftPressed = false;  

//set goalpost dimensions
var TDWidth = 150;
var FieldGoalpostHeight = 10;

//initialize scorecard
var homeScore = 0;
var awayScore = 0;

//set player dimensions
var playerHeight = 50;
var playerWidth = 30;


//set params
var initFlag = true;
var gameOver = false;
var flag1 = 1;
var flag2 = 1;
var drawFlag = true;

//register for keypress events
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


//initialize SAT.js variables
var V = SAT.Vector;
var C = SAT.Circle;
var B = SAT.Box;

var circle;
var box;

//initialize images
var homePlayer = new Image();
var awayPlayer = new Image();


//starting here
function init() {
    removeStatus();
    homePlayer.src = 'img/homePlayer.png';
    awayPlayer.src = 'img/awayPlayer.png';
    document.getElementById('startScreen').style['z-index'] = '-1';
    document.getElementById('gameOverScreen').style['z-index'] = '-1';
    document.getElementById('home').innerHTML = '0';
    document.getElementById('away').innerHTML = '0';
    awayScore = 0;
    homeScore = 0;
    gameOver = 0;
    setInitialDelay();
}

function setInitialDelay() {
    setTimeout(function() {
        startTimer(60 * 2);
        drawFlag = true;
        window.requestAnimationFrame(draw);
        updateStatus('You are team <br> in <span style="color:red">REDWINE</span>');
    }, 1500);
}

function setDelay() {
    setTimeout(function() {
        drawFlag = true;
        window.requestAnimationFrame(draw);
    }, 1500);
}

function startTimer(duration) {
    var timer = duration,
        minutes, seconds;
    countdown = setInterval(function() {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('countdown').innerHTML = minutes + ":" + seconds;

        if (--timer < 0) {
            document.getElementById('gameOverScreen').style['z-index'] = 3;
            gameOver = true;
            clearInterval(countdown);
            if (homeScore > awayScore)
                updateStatus('GAME OVER!');
            else if (awayScore > homeScore)
                updateStatus('GAME OVER!<br>');
            else
                updateStatus('GAME OVER!<br>Draw!')
        }
    }, 1000);
}

//it all happens here
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPlayers();
    drawGoalPost();
    x += dx;
    y += dy;
    if (rightPressed && paddleX * 3 / 4 + m < canvas.width - paddleWidth) {
        m += 2;
    } else if (leftPressed && paddleX / 4 + m > 0) {
        m -= 2;
    }
    if (drawFlag && !gameOver)
        window.requestAnimationFrame(draw);
}


function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "brown";
    ctx.fill();
    ctx.closePath();
    circle = new C(new V(x, y), 6);
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
            if(x<0)
                x=0;
            if(x>canvas.width)
                x = canvas.width; 
    }
    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }

}

function drawPlayers() {
    drawHomeTeam();
    drawAwayTeam();
    
}

function drawHomeTeam() {
    //home
    drawRunning();
    drawBLOCKERs();
}

function drawAwayTeam() {
    //away
    null();
    drawAwayDefenders();
    null();
}

function FieldGoalPost() {

    //home
    ctx.beginPath();
    var gphX = (canvas.width - FieldGoalpostWidth) / 2;
    var gphY = canvas.height - FieldGoalpostHeight;
    ctx.rect(gphX, gphY, FgoalpostWidth, goalpostHeight);
    ctx.fillStyle = "#9C9C9C";
    ctx.fill();
    ctx.closePath();
    box = new B(new V(gphX, gphY), FieldgoalpostWidth, FieldgoalpostHeight).toPolygon();
    if (FieldgoalDetection(box)) {
        updateScore('home');
        updateStatus('FieldGoal');
        removeStatus();
        resetBall();
        setDelay();
    }
    //away
    ctx.beginPath();
    var gpaX = (canvas.width - goalpostWidth) / 2;
    var gpaY = paddleHeight - goalpostHeight;
    ctx.rect(gpaX, gpaY, goalpostWidth, goalpostHeight);
    ctx.fillStyle = "#9C9C9C";
    ctx.fill();
    ctx.closePath();

    box = new B(new V(gpaX, gpaY), FieldgoalpostWidth, FieldgoalpostHeight).toPolygon();
    if (goalDetection(box)) {
        updateScore('away');
        updateStatus('FIELDGOAL');
        removeStatus();
        resetBall();
        setDelay();
    }
}


function updateScore(goal) {

    if (goal === 'home') {
        awayScore += 1;
        document.getElementById('away').innerHTML = awayScore;
    } else {
        homeScore += 1;
        document.getElementById('home').innerHTML = homeScore;
    }
}

function resetBall() {
    x = canvas.width / 2;
    y = canvas.height / 2;
    drawBall();
    drawFlag = false;
    window.requestAnimationFrame(draw);

}

function updateStatus(message) {
    document.getElementById('status').innerHTML = message;

}

function removeStatus() {
    setTimeout(function() {
        document.getElementById('status').innerHTML = '';
    }, 1500);
}

function drawDefenders() {

    var lcbX = paddleX / 4 + m;
    var lcbY = canvas.height * 13 / 16 - paddleHeight;
    drawRods(lcbY);
    ctx.drawImage(homePlayer, lcbX, lcbY - 15, playerWidth, playerHeight);
    box = new B(new V(lcbX, lcbY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, lcbX);

    var rcbX = paddleX * 3 / 4 + m;
    var rcbY = canvas.height * 13 / 16 - paddleHeight;
    ctx.drawImage(homePlayer, rcbX, rcbY - 15, playerWidth, playerHeight);
    box = new B(new V(rcbX, rcbY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, rcbX);
}

function drawReturnteam() {

    //midfielders
    var lwbX = paddleX * 1 / 8 + m;
    var lwbY = canvas.height * 5 / 8 - paddleHeight;
    drawRods(lwbY);
    ctx.drawImage(homePlayer, lwbX, lwbY - 15, playerWidth, playerHeight);
    box = new B(new V(lwbX, lwbY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, lwbX);

    var lcmX = paddleX * 3 / 8 + m;
    var lcmY = canvas.height * 5 / 8 - paddleHeight;
    ctx.drawImage(homePlayer, lcmX, lcmY - 15, playerWidth, playerHeight);
    box = new B(new V(lcmX, lcmY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, lcmX);

    var rcmX = paddleX * 5 / 8 + m;
    var rcmY = canvas.height * 5 / 8 - paddleHeight;
    ctx.drawImage(homePlayer, rcmX, rcmY - 15, playerWidth, playerHeight);
    box = new B(new V(rcmX, rcmY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, rcmX);

    var rwbX = paddleX * 7 / 8 + m;
    var rwbY = canvas.height * 5 / 8 - paddleHeight;
    ctx.drawImage(homePlayer, rwbX, rwbY - 15, playerWidth, playerHeight);
    box = new B(new V(rwbX, rwbY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, rwbX);

}

function drawLineMen() {
    //attackers
    var lwX = paddleX / 4 + m;
    var lwY = canvas.height * 9 / 32 - paddleHeight;
    drawRods(lwY);
    ctx.drawImage(homePlayer, lwX, lwY - 15, playerWidth, playerHeight);
    box = new B(new V(lwX, lwY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, lwX);

    var cfX = paddleX / 2 + m;
    var cfY = canvas.height * 9 / 32 - paddleHeight;
    ctx.drawImage(homePlayer, cfX, cfY - 15, playerWidth, playerHeight);
    box = new B(new V(cfX, cfY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, cfX);

    var rwX = paddleX * 3 / 4 + m;
    var rwY = canvas.height * 9 / 32 - paddleHeight;
    ctx.drawImage(homePlayer, rwX, rwY - 15, playerWidth, playerHeight);
    box = new B(new V(rwX, rwY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, rwX);

}



function drawAwayReturn() {

    var gkX = paddleX / 2 + j;
    var gkY = canvas.height * 1 / 8 - paddleHeight;
    drawRods(gkY);
    ctx.drawImage(awayPlayer, gkX, gkY - 15, playerWidth, playerHeight);
    box = new B(new V(gkX, gkY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, gkX);

    if (x > gkX && gkX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (gkX > paddleX * 1 / 4)
        j -= aiSpeed;

}

function drawAwayDefenders() {

    var lcbX = paddleX / 4 + j;
    var lcbY = canvas.height * 3 / 16 - paddleHeight;
    drawRods(lcbY);
    ctx.drawImage(awayPlayer, lcbX, lcbY - 15, playerWidth, playerHeight);
    box = new B(new V(lcbX, lcbY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, lcbX);

    var rcbX = paddleX * 3 / 4 + j;
    var rcbY = canvas.height * 3 / 16 - paddleHeight;
    ctx.drawImage(awayPlayer, rcbX, rcbY - 15, playerWidth, playerHeight);
    box = new B(new V(rcbX, rcbY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, rcbX);

    if (x > lcbX && lcbX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (lcbX > paddleX * 1 / 4)
        j -= aiSpeed;
    if (x > rcbX && rcbX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (rcbX > paddleX * 1 / 4)
        j -= aiSpeed;
}

function drawAwayFullteam() {

    //midfielders
    var lwbX = paddleX * 1 / 8 + j;
    var lwbY = canvas.height * 3 / 8 - paddleHeight;
    drawRods(lwbY)
    ctx.drawImage(awayPlayer, lwbX, lwbY - 15, playerWidth, playerHeight);
    box = new B(new V(lwbX, lwbY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, lwbX);

    var lcmX = paddleX * 3 / 8 + j;
    var lcmY = canvas.height * 3 / 8 - paddleHeight;
    ctx.drawImage(awayPlayer, lcmX, lcmY - 15, playerWidth, playerHeight);
    box = new B(new V(lcmX, lcmY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, lcmX);

    var rcmX = paddleX * 5 / 8 + j;
    var rcmY = canvas.height * 3 / 8 - paddleHeight;
    ctx.drawImage(awayPlayer, rcmX, rcmY - 15, playerWidth, playerHeight);
    box = new B(new V(rcmX, rcmY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, rcmX);

    var rwbX = paddleX * 7 / 8 + j;
    var rwbY = canvas.height * 3 / 8 - paddleHeight;
    ctx.drawImage(awayPlayer, rwbX, rwbY - 15, playerWidth, playerHeight);
    box = new B(new V(rwbX, rwbY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, rwbX);

    if (x > lwbX && lwbX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (lwbX > paddleX * 1 / 4)
        j -= aiSpeed;
    if (x > rwbX && rwbX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (rwbX > paddleX * 1 / 4)
        j -= aiSpeed;
    if (x > rcmX && rcmX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (rcmX > paddleX * 1 / 4)
        j -= aiSpeed;
    if (x > lcmX && lcmX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (lcmX > paddleX * 1 / 4)
        j -= aiSpeed;
}


function drawNewPlay() {
    //attackers
    ctx.beginPath();
    var lwX = paddleX / 4 + j;
    var lwY = canvas.height * 23 / 32 - paddleHeight;
    drawRods(lwY);
    ctx.drawImage(awayPlayer, lwX, lwY - 15, playerWidth, playerHeight);
    box = new B(new V(lwX, lwY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, lwX);

    ctx.beginPath();
    var cfX = paddleX / 2 + j;
    var cfY = canvas.height * 23 / 32 - paddleHeight;
    ctx.drawImage(awayPlayer, cfX, cfY - 15, playerWidth, playerHeight);
    box = new B(new V(cfX, cfY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, cfX);

    ctx.beginPath();
    var rwX = paddleX * 3 / 4 + j;
    var rwY = canvas.height * 23 / 32 - paddleHeight;
    ctx.drawImage(awayPlayer, rwX, rwY - 15, playerWidth, playerHeight);
    box = new B(new V(rwX, rwY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, rwX);


    // if(y + 10 == rwY || y - 10 == rwY) {
    if (x > lwX && lwX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (lwX > paddleX * 1 / 4)
        j -= aiSpeed;
    if (x > rwX && rwX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (rwX > paddleX * 1 / 4)
        j -= aiSpeed;
    if (x > cfX && cfX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (cfX > paddleX * 1 / 4)
        j -= aiSpeed;
    //}


}


function collisionDetection(box, pX) {
    var response = new SAT.Response();
    if (SAT.testPolygonCircle(box, circle, response)) {
        var speed = (x + (12 / 2) - pX + (20 / 2)) / (20 / 2) * 5;
        if (flag1 == 1) {
            if (dy > 0) {
                dy = -dy;
                y = y - speed;
                if (dx > 0)
                    x = x + speed;
                else
                    x = x - speed;
            } else {
                y = y - speed;
                if (dx > 0)
                    x = x - speed;
                else
                    x = x + speed;
            }
            flag1 = 0;
        }
    } else
        flag1 = 1;
}

function collisionDetectionAway(box, pX) {
    var response = new SAT.Response();
    if (SAT.testPolygonCircle(box, circle, response)) {
        var speed = (x + (12 / 2) - pX + (20 / 2)) / (20 / 2) * 5;
        if (flag2 == 1) {
            if (dy < 0) {
                dy = -dy;
                y = y + speed;
                if (dx > 0)
                    x = x + speed;
                else
                    x = x - speed;
            } else {
                y = y + speed;
                if (dx > 0)
                    x = x + speed;
                else
                    x = x - speed;
            }
        }
    } else
        flag2 = 1;
}


function TouchDownDetection(box) {
    var response = new SAT.Response();
    return SAT.testPolygonCircle(box, circle, response);
}

function drawBounds(yAxis) {
    ctx.beginPath();
    ctx.rect(0, yAxis + 2, canvas.width, paddleHeight - 5);
    ctx.fillStyle = "#BDBDBD";
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
}

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

var init = requestAnimationFrame(start);
var player1 = new Player(100,250);
var player2 = new Player(600,250);
var ball = new Ball(350,250);
var wDown = false;
var sDown = false;
var aDown = false;
var dDown = false;
var upDown = false;
var downDown = false;
var leftDown = false;
var rightDown = false;
function start(){
	clear();
	renderBackground();
	renderGates();
	checkKeyboardStatus();
	checkPlayersBounds();
	checkBallBounds();
	checkPlayers_BallCollision();
	movePlayers();
	moveBall();
	renderPlayers();
	renderBall();

	out.innerHTML = "Player 1 Score: " + player1.score + "<br>Player 2 Score: " + player2.score;
	requestAnimationFrame(start);
}

function Ball(x,y){
	this.x = x;
	this.y = y;
	this.xVel = 0;
	this.yVel = 0;
	this.decel = 0.1;
	this.size = 5;
}

function Player(x,y){
	this.x = x;
	this.y = y;
	this.size = 20;
	this.xVel = 0;
	this.yVel = 0;
	this.score = 0;
	this.accel = 0.55;
	this.decel = 0.55;
	this.maxSpeed = 3;
}

function reset(){
	var score1 = player1.score;
	var score2 = player2.score;
	player1 = new Player(100,250);
	player1.score = score1;
	player2 = new Player(600,250);
	player2.score = score2;
	ball = new Ball(350,250);
	wDown = false;
	sDown = false;
	aDown = false;
	dDown = false;
	upDown = false;
	downDown = false;
	leftDown = false;
	rightDown = false;
}

function movePlayers(){
	player1.x += player1.xVel;
	player1.y += player1.yVel;
	player2.x += player2.xVel;
	player2.y += player2.yVel;
}

function checkPlayers_BallCollision(){
	var p1_ball_distance = getDistance(player1.x,player1.y,ball.x,ball.y) - player1.size - ball.size;
	if(p1_ball_distance < 0){
		collide(ball,player1);
	}
	var p2_ball_distance = getDistance(player2.x,player2.y,ball.x,ball.y) - player2.size - ball.size;
	if(p2_ball_distance < 0){
		collide(ball,player2);
	}
}

function collide(cir1,cir2){
	var dx = (cir1.x - cir2.x) / (cir1.size);
	var dy = (cir1.y - cir2.y) / (cir1.size);
	cir2.xVel = -dx;
	cir2.yVel = -dy;
	cir1.xVel = dx;
	cir1.yVel = dy;
}

function getDistance(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

function moveBall(){
	if(ball.xVel !== 0){
		if(ball.xVel > 0){
			ball.xVel -= ball.decel;
			if(ball.xVel < 0) ball.xVel = 0;
		} else {
			ball.xVel += ball.decel;
			if(ball.xVel > 0) ball.xVel = 0;
		}
	}
	if(ball.yVel !== 0){
		if(ball.yVel > 0){
			ball.yVel -= ball.decel;
			if(ball.yVel < 0) ball.yVel = 0;
		} else {
			ball.yVel += ball.decel;
			if(ball.yVel > 0) ball.yVel = 0;
		}
	}
	ball.x += ball.xVel;
	ball.y += ball.yVel;
}

function checkBallBounds(){
	if(ball.x + ball.size > canvas.width){
		if(ball.y > 150 && ball.y < 350){
			player1.score++;
			reset();
			return;
		}
		ball.x = canvas.width - ball.size;
		ball.xVel *= -1.5;
	}
	if(ball.x - ball.size < 0){
		if(ball.y > 150 && ball.y < 350){
			player2.score++;
			reset();
			return;
		}
		ball.x = 0 + ball.size;
		ball.xVel *= -1.5;
	}
	if(ball.y + ball.size > canvas.height){
		ball.y = canvas.height - ball.size;
		ball.yVel *= -1.5;
	}
	if(ball.y - ball.size < 0){
		ball.y = 0 + ball.size;
		ball.yVel *= -1.5;
	}
}

function checkPlayersBounds(){
	if(player1.x + player1.size > canvas.width){
		player1.x = canvas.width - player1.size;
		player1.xVel *= -0.5;
	}
	if(player1.x - player1.size < 0){
		player1.x = 0 + player1.size;
		player1.xVel *= -0.5;
	}
	if(player1.y + player1.size > canvas.height){
		player1.y = canvas.height - player1.size;
		player1.yVel *= -0.5;
	}
	if(player1.y - player1.size < 0){
		player1.y = 0 + player1.size;
		player1.yVel *= -0.5;
	}
	if(player2.x + player2.size > canvas.width){
		player2.x = canvas.width - player2.size;
		player2.xVel *= -0.5;
	}
	if(player2.x - player2.size < 0){
		player2.x = 0 + player2.size;
		player2.xVel *= -0.5;
	}
	if(player2.y + player2.size > canvas.height){
		player2.y = canvas.height - player2.size;
		player2.yVel *= -0.5;
	}
	if(player2.y - player2.size < 0){
		player2.y = 0 + player2.size;
		player2.yVel *= -0.5;
	}
}

function checkKeyboardStatus(){
	if(wDown){
		if(player1.yVel > -player1.maxSpeed){
			player1.yVel -= player1.accel;	
		} else {
			player1.yVel = -player1.maxSpeed;
		}
	} else {
		if(player1.yVel < 0){
			player1.yVel += player1.decel;
			if(player1.yVel > 0) player1.yVel = 0;	
		}
	}
	if(sDown){
		if(player1.yVel < player1.maxSpeed){
			player1.yVel += player1.accel;	
		} else {
			player1.yVel = player1.maxSpeed;
		}
	} else {
		if(player1.yVel > 0){
			player1.yVel -= player1.decel;
			if(player1.yVel < 0) player1.yVel = 0;
		}
	}
	if(aDown){
		if(player1.xVel > -player1.maxSpeed){
			player1.xVel -= player1.accel;	
		} else {
			player1.xVel = -player1.maxSpeed;
		}
	} else {
		if(player1.xVel < 0){
			player1.xVel += player1.decel;
			if(player1.xVel > 0) player1.xVel = 0;	
		}
	}
	if(dDown){
		if(player1.xVel < player1.maxSpeed){
			player1.xVel += player1.accel;	
		} else {
			player1.xVel = player1.maxSpeed;
		}
	} else {
		if(player1.xVel > 0){
			player1.xVel -= player1.decel;
			if(player1.xVel < 0) player1.xVel = 0;
		}
	}

	//PLAYER 2

	if(upDown){
		if(player2.yVel > -player2.maxSpeed){
			player2.yVel -= player2.accel;	
		} else {
			player2.yVel = -player2.maxSpeed;
		}
	} else {
		if(player2.yVel < 0){
			player2.yVel += player2.decel;
			if(player2.yVel > 0) player2.yVel = 0;	
		}
	}
	if(downDown){
		if(player2.yVel < player2.maxSpeed){
			player2.yVel += player2.accel;	
		} else {
			player2.yVel = player2.maxSpeed;
		}
	} else {
		if(player2.yVel > 0){
			player2.yVel -= player2.decel;
			if(player2.yVel < 0) player2.yVel = 0;
		}
	}
	if(leftDown){
		if(player2.xVel > -player2.maxSpeed){
			player2.xVel -= player2.accel;	
		} else {
			player2.xVel = -player2.maxSpeed;
		}
	} else {
		if(player2.xVel < 0){
			player2.xVel += player2.decel;
			if(player2.xVel > 0) player2.xVel = 0;	
		}
	}
	if(rightDown){
		if(player2.xVel < player2.maxSpeed){
			player2.xVel += player2.accel;	
		} else {
			player2.xVel = player2.maxSpeed;
		}
	} else {
		if(player2.xVel > 0){
			player2.xVel -= player2.decel;
			if(player2.xVel < 0) player2.xVel = 0;
		}
	}
}

document.onkeyup = function(e){
	if(e.keyCode === 87){
		wDown = false;
	}
	if(e.keyCode === 65){
		aDown = false;
	}
	if(e.keyCode === 68){
		dDown = false;
	}
	if(e.keyCode === 83){
		sDown = false;
	}
	if(e.keyCode === 38){
		upDown = false;
	}
	if(e.keyCode === 37){
		leftDown = false;
	}
	if(e.keyCode === 40){
		downDown = false;
	}
	if(e.keyCode === 39){
		rightDown = false;
	}
}

document.onkeydown = function(e){
	if(e.keyCode === 87){
		wDown = true;
	}
	if(e.keyCode === 65){
		aDown = true;
	}
	if(e.keyCode === 68){
		dDown = true;
	}
	if(e.keyCode === 83){
		sDown = true;
	}
	if(e.keyCode === 38){
		upDown = true;
	}
	if(e.keyCode === 37){
		leftDown = true;
	}
	if(e.keyCode === 40){
		downDown = true;
	}
	if(e.keyCode === 39){
		rightDown = true;
	}
}

function renderBall(){
	c.save();
	c.beginPath();
	c.fillStyle = "black";
	c.arc(ball.x,ball.y,ball.size,0,Math.PI*2);
	c.fill();
	c.closePath();
	c.restore();
}

function renderPlayers(){
	c.save();
	c.fillStyle = "red";
	c.beginPath();
	c.arc(player1.x,player1.y,player1.size,0,Math.PI*2);
	c.fill();
	c.closePath();
	c.beginPath();
	c.fillStyle = "blue";
	c.arc(player2.x,player2.y,player2.size,0,Math.PI*2);
	c.fill();
	c.closePath();
	c.restore();
}

function rendertemplates(){
	c.save();
	c.beginPath();
	c.moveTo(0,150);
	c.lineTo(0,350);
	c.strokeStyle = "red";
	c.lineWidth = 10;
	c.stroke();
	c.closePath();
	c.beginPath();
	c.moveTo(canvas.width,150);
	c.lineTo(canvas.width,350);
	c.strokeStyle = "blue";
	c.lineWidth = 10;
	c.stroke();
	c.closePath();
	c.restore();
}

function renderBackground(){
	c.save();
	c.fillStyle = "#66aa66";
	c.fillRect(0,0,canvas.width,canvas.height);
	c.strokeStyle = "rgba(255,255,255,0.6)";
	c.beginPath();
	c.arc(canvas.width/2,canvas.height/2,150,0,Math.PI*2);
	c.closePath();
	c.lineWidth = 10;
	c.stroke();
	c.restore();
}

function clear(){
	c.clearRect(0,0,canvas.width,canvas.height);
}
