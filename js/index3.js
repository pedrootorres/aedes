window.onload = function() {
	document.getElementById("startButton").style.visibility = 'visible';
};

var gameZone = document.getElementById("gameZone");
var scoreMosquitos = document.getElementById("scoreMosquitos");
var scoreSource = document.getElementById("scoreSource");
var repellentQty = document.getElementById("repellentQty");
var personLeft = document.getElementById("person").getBoundingClientRect().left;

var random = new randomNumber();

var mainInterval;

var stopGame = false;

var frame;
var trashFrequency;
var mosquitoFrequency;
var intervalFrequency = 20;

var repellentProbability = 0.10;

var amountOfTrash = 0;
var currentLevel = 1;

// var typesTrash = ['tire', 'vaseRed', 'vaseYellow', 'garbage', 'waterTank'];
var typesTrash = ['tire', 'vaseRed', 'vaseYellow'];

/*
* 0 = racket
* 1 = broom
* 2 = shovel
* 3 = hand
*/
var weapon = 0;



function begin() {
	document.getElementById("start").style.visibility = "hidden";
	document.getElementById("startButton").style.visibility = 'hidden';

	// mainInterval = setInterval(updateGame, 20);
	// newSetInterval(updateGame, intervalFrequency);
	nextLevel(currentLevel);
}

function nextLevel (lvl) {
	if(lvl == 1) {
		frame = 0;
		trashFrequency = 6000;
		mosquitoFrequency = 2000;
		amountOfTrash = 5;		
	} else if(lvl == 2) {
		frame = 0;
		trashFrequency = 5500;
		mosquitoFrequency = 1900;
		amountOfTrash = 8;		
	} else if(lvl == 3) {
		frame = 0;
		trashFrequency = 5000;
		mosquitoFrequency = 1900;
		amountOfTrash = 12;		
	} else if(lvl == 4) {
		frame = 0;
		trashFrequency = 4500;
		mosquitoFrequency = 1700;
		amountOfTrash = 16;		
	} else if(lvl == 5) {
		frame = 0;
		trashFrequency = 4500;
		mosquitoFrequency = 1500;
		amountOfTrash = 18;		
	} else {
		// fim de jogo
	}

	for(var i = 0; i < amountOfTrash; i++) {
		addTrash();
	}

	document.getElementById("threeTwoOne").style.visibility = "visible";
	var threeTwoOne = document.getElementById("threeTwoOne").children[1];
	document.getElementById("threeTwoOne").children[0].textContent = "Fase " + lvl;

	var countdown = 3;
	threeTwoOne.textContent = countdown;

	document.getElementById("blackCurtains").style.visibility = "visible";
	var countdownInterval = setInterval(function() {
		if(countdown < 1) {
			clearInterval(countdownInterval);
			document.getElementById("blackCurtains").style.visibility = "hidden";
			document.getElementById("threeTwoOne").style.visibility = "hidden";
			stopGame = false;
			mainInterval = setInterval(updateGame, 20);
		}

		countdown--;
		threeTwoOne.textContent = countdown;
	}, 1000);
}

function updateGame() {
	if(frame % trashFrequency == 0 && frame > 0) {
		addTrash();
		amountOfTrash++;

		changeMosquitoFrequency(-100);
	}

	if(frame % mosquitoFrequency == 0 && frame > 0) {
		console.log("passou");
		var m = new addMosquito();
		m.fly();

		if(random.get() <= repellentProbability){
			addRepellent();
		}
	}

	frame+=intervalFrequency;

	if(amountOfTrash == 0) {
		clearInterval(mainInterval);
		nextLevel(++currentLevel);
	}
}

function changeMosquitoFrequency(ms) {
	var temp = mosquitoFrequency + ms;

	if(temp < 500) {
		mosquitoFrequency = 500;
	} else if(temp > 2000 ) {
		mosquitoFrequency = 2000;
	} else {
		mosquitoFrequency = temp;
	}
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
	trash.setAttribute('life', 10);
	trash.setAttribute('type', whichTrash);
	trash.setAttribute('onclick', 'destroyTrash(this)');
	trash.style.left = left;
	trash.style.bottom = random.get() * (1000-900) + 900;

	gameZone.appendChild(trash);

	var g = setInterval(function() {
		gravity(trash, g);
	}, 25);
}

function destroyTrash (t) {
	var rightWeapon = false;

	if(weapon == 1) {
		if(t.getAttribute('type') == 3) {
			rightWeapon = true;
		}
	} else if(weapon == 2) {
		if(t.getAttribute('type') == 1 || t.getAttribute('type') == 2) {
			rightWeapon = true;
		}
	} else if(weapon == 3) {
		if(t.getAttribute('type') == 0 || t.getAttribute('type') == 4) {
			rightWeapon = true;
		}
	}

	if(rightWeapon) {
		var life = parseInt(t.getAttribute('life'));
		life--;

		if(life < 0) {
			t.parentNode.removeChild(t);
			amountOfTrash--;
			scoreSource.textContent = parseInt(scoreSource.textContent) + 1;

			if(amountOfTrash == 0) {
				endCurrentLevel();
			} else {
				changeMosquitoFrequency(100);
			}
		} else {
			t.setAttribute('life', life);
		}
	}
}

function endCurrentLevel() {
	stopGame = true;
	clearInterval(mainInterval);

	var allMosquitos = document.getElementsByClassName("aedes");
	while(allMosquitos[0]) {
		allMosquitos[0].parentNode.removeChild(allMosquitos[0]);
	}

	nextLevel(++currentLevel);
}

function addMosquito() {
	var x = Math.floor(random.get() * (window.innerHeight-200 - 200) + 200);

	this.mosquito = document.createElement('div');
	this.mosquito.setAttribute('class', 'aedes');
	this.mosquito.style.top = x;
	this.mosquito.style.left = -100;

	gameZone.appendChild(this.mosquito);

	var probs = random.get();
	this.speed;

	if(probs < 0.05) {
		this.speed = 8;
	} else if(probs < 0.15) {
		this.speed = 6;
	} else if(probs < 0.40) {
		this.speed = 1;
	} else if(probs < 0.80) {
		this.speed = 3;
	} else if(probs < 1) {
		this.speed = 4	
	}

	this.flyInterval;

	this.fly = function() {
		var mosquito = this.mosquito;
		var speed = this.speed;
		var me = this;
		this.flyInterval = setInterval(function() {
			fly(mosquito, speed, me);
		}, 25);
	}

	this.stopFlying = function() {
		clearInterval(this.flyInterval);
	}

	var me = this;
	this.mosquito.onclick = function() { killMosquito(me); };
}

function fly(mosquito, speed, me) {
	var left = parseInt(mosquito.style.left);
	left += speed;
	mosquito.style.left = left;

	if(left > personLeft) {
		collision(me);
	} else if(stopGame) {
		me.stopFlying();
	}
}

function collision(me) {
	stopGame = true;
	me.stopFlying();

	clearInterval(mainInterval);
}

function killMosquito(me) {
	console.log(me);
	if(weapon == 0) {
		me.mosquito.parentNode.removeChild(me.mosquito);
		me.stopFlying();

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