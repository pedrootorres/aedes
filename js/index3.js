window.onload = function() {
	document.getElementById("startButton").style.visibility = 'visible';
};

var gameZone = document.getElementById("gameZone");
var scoreMosquitos = document.getElementById("scoreMosquitos");
var scoreSource = document.getElementById("scoreSource");
var repellentQty = document.getElementById("repellentQty");

var random = new randomNumber();

var mainInterval;

var frame = -1000;
var trashFrequency = 4000;
var mosquitoFrequency = 2000;
var intervalFrequency = 1000;

var repellentProbability = 0.10;

var typesTrash = ['tire', 'vaseRed', 'vaseYellow'];

/*
* 0 = racket
*/
var weapon = 0;



function begin() {
	document.getElementById("start").style.visibility = "hidden";
	document.getElementById("startButton").style.visibility = 'hidden';

	// mainInterval = setInterval(updateGame, 20);
	newSetInterval(updateGame, intervalFrequency);
}

function updateGame() {
	if(frame % trashFrequency == 0) {
		addTrash();
	}

	if(frame % mosquitoFrequency == 0) {
		addMosquito();

		if(random.get() <= repellentProbability){
			addRepellent();
		}
	}

	frame+=intervalFrequency;
}

function addRepellent() {
	var x = Math.floor(random.get() * (window.innerHeight-200 - 150) + 150);
	var y = Math.floor(random.get() * (window.innerWidth-100));

	var repellent = document.createElement("img");
	repellent.setAttribute('class', 'repellent');
	repellent.setAttribute('src', 'img/repellent.png');
	repellent.setAttribute('onclick', 'increaseRepellent(this)');
	repellent.style.top = x;
	repellent.style.left = y;

	gameZone.appendChild(repellent);

	setTimeout(function() {
		repellent.parentNode.removeChild(repellent);
	}, 1000);
}

function increaseRepellent(r) {
	r.parentNode.removeChild(r);

	var qty = parseInt(repellentQty.textContent.substring(1));
	qty++;
	repellentQty.textContent = "x " + qty;
}

function useRepellent() {
	var qty = parseInt(repellentQty.textContent.substring(1));
	
	if(qty > 0) {
		qty--;
		repellentQty.textContent = "x " + qty;
		clearInterval(mainInterval);

		var allMosquitos = document.getElementsByClassName("aedes");
		while(allMosquitos[0]) {
			allMosquitos[0].parentNode.removeChild(allMosquitos[0]);
		}

		newSetInterval(updateGame, intervalFrequency);
	}
}

function addTrash() {
	var whichTrash = Math.floor(random.get() * typesTrash.length);
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
	if(weapon == 0) {
		mosquito.parentNode.removeChild(mosquito);

		value = parseInt(scoreMosquitos.textContent);
		value++;

		scoreMosquitos.textContent = value;
	}
}

function changeWeapon(w) {
	weapon = parseInt(w.getAttribute("type"));

	if(weapon == 0) {
		gameZone.style.cursor = "url(http://cur.cursors-4u.net/toons/too-9/too908.png), auto";
	} else if(weapon == 1) {

	} else if(weapon == 2) {

	} else {

	}
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

	mainInterval = setTimeout(function() {
		newSetInterval.apply(scope, args);
	}, duration);
}