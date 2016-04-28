window.onload = function() {
	document.getElementById("startButton").style.visibility = 'visible';
};

var gameZone = document.getElementById("gameZone");
var scoreMosquitos = document.getElementById("scoreMosquitos");
var scoreSource = document.getElementById("scoreSource");

var random = new randomNumber();

var mainInterval;

var frame = -1000;
var trashFrequency = 4000;
var mosquitoFrequency = 2000;

var typesTrash = ['tire', 'vaseRed', 'vaseYellow'];

function begin() {
	document.getElementById("start").style.visibility = "hidden";
	document.getElementById("startButton").style.visibility = 'hidden';

	// mainInterval = setInterval(updateGame, 20);
	newSetInterval(updateGame, 1000);
}

function updateGame() {
	if(frame % trashFrequency == 0) {
		addTrash();
	}

	if(frame % mosquitoFrequency == 0) {
		addMosquito();
	}

	frame+=1000;
}

function addTrash() {
	var whichTrash = Math.floor(random.get() * 3);
	var left = Math.floor(random.get() * (window.innerWidth-100));

	var trash = document.createElement('div');
	trash.setAttribute('class', 'trash ' + typesTrash[whichTrash]);
	trash.setAttribute('onclick', 'destroyTrash(this)');
	trash.style.left = left;
	trash.style.bottom = random.get() * (1000-900) + 900;

	gameZone.appendChild(trash);

	var g = setInterval(function() {
		gravity(trash, g);
	}, 25);
}

function addMosquito() {
	var x = Math.floor(random.get() * (window.innerHeight-200 - 150) + 150);
	var y = Math.floor(random.get() * (window.innerWidth-100));

	var mosquito = document.createElement('div');
	mosquito.setAttribute('class', 'aedes');
	mosquito.setAttribute('onMouseDown', 'killMosquito(this)');
	mosquito.style.top = x;
	mosquito.style.left = y;

	gameZone.appendChild(mosquito);
}

function killMosquito(mosquito) {
	mosquito.parentNode.removeChild(mosquito);

	value = parseInt(scoreMosquitos.textContent);
	value++;

	scoreMosquitos.textContent = value;
}

function gravity(obj, inter) {
	var y = parseInt(obj.style.bottom);
	y-=8;
	obj.style.bottom = y;
	if(y < 48) {
		clearInterval(inter);
	}
}

function randomNumber() {
	this.last = Date.now() % 100;

	this.get = function() {
		this.last = (this.last * 32719 + 3) % 32749;
		return (this.last % 100) / 100;
	}
}

function newSetInterval(callback, duration, callbackArguments) {
	callback.apply(this, callbackArguments);
	var args = arguments, scope = this;

	setTimeout(function() {
		newSetInterval.apply(scope, args);
	}, duration);
}