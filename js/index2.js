var gameArea;
var context;

var mainInterval;

var frame = 0;

var trashFrequency = 4000;
var mosquitoFrequency = 2000;

function begin() {
	document.getElementById("start").style.visibility = "hidden";

	gameArea = document.createElement("canvas");
	gameArea.width = window.innerWidth;
	gameArea.height = window.innerHeight;

	context = gameArea.getContext('2d');
	document.body.appendChild(gameArea);

	// mosquitoInterval = setInterval(addMosquito, mosquitoFrequency);
	mainInterval = setInterval(updateGame, 20);
}

function updateGame() {
	if(frame % trashFrequency == 0 && frame != 0) {
		addTrash();
		console.log("passou");
	}

	if(frame % mosquitoFrequency == 0) {
		// addMosquito();
		console.log("mosquito");
	}

	frame+=20;
}

function addMosquito() {

}

function mosquito(x, y, img) {
	this.image = img;
	this.x = x;
	this.y = y;
	this.width = img.width;
	this.height = img.height;
	return this;
}

// function addTrash() {
// 	// random to select type of trash;

// 	var plantVase = new trash(0, 0, "img/vasos/vasos_vaso_1 copy.png");
// 	// plantVase.update();

// 	var img = new Image();

// 	plantVase.onload = function() {
// 		context.drawImage(img, 0, gameArea.height-200);
// 	};
// 	img.src = "img/vasos/vasos_vaso_1 copy.png";
// }

// function trash(x, y, src) {
// 	// this.img = new Image();
// 	// this.img.src = src;
// 	// this.x = x;
// 	// this.y = y;
// 	// this.acceleration = 0.05;
// 	// this.gravitySpeed = 0;

// 	// this.gravity = function() {
// 	// 	this.gravitySpeed += this.acceleration;
// 	// 	this.y += this.gravitySpeed;
// 	// }

// 	// this.update = function() {
// 	// 	this.img.onload = function() {
// 	// 		context.drawImage(this.img, this.x, this.y);
// 	// 	};
// 	// }

// 	// var img = new Image();

// 	// plantVase.onload = function() {
// 	// 	context.drawImage(img, 0, gameArea.height-200);
// 	// };
// 	// img.src = "img/vasos/vasos_vaso_1 copy.png";
// }