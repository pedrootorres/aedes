var gameZone = document.getElementById("gameZone");
var scoreMosquitos = document.getElementById("scoreMosquitos");
var allTrash = document.getElementsByClassName("trash");
var playerStatus = document.getElementById("disease");

var mosquitoFrequency = 2000;
var gameFrequency = 4000;

var mainInterval;
var mosquitoInterval;

var probs = 0;
var value = 0;
var allMosquitos = 0;
var clockProbability = 0.15;
var clockEffect = false;

var mosquito;

function addMosquito() {
	x = Math.floor(Math.random() * 80);
	y = Math.floor(Math.random() * 85);

	mosquito = document.createElement('div');
	mosquito.setAttribute('class', 'aedes');
	mosquito.setAttribute('onMouseDown', 'killMosquito(this)');
	mosquito.style.top = x + "%";
	mosquito.style.left = y + "%";

	allMosquitos++;
	gameZone.appendChild(mosquito);

	if(allMosquitos > 100) {
		clearInterval(mainInterval);
		clearInterval(mosquitoInterval);
		document.getElementById("blackCurtains").style.visibility = "visible";
		document.getElementById("finalScore").textContent = document.getElementById("score").textContent;
		document.getElementById("over").style.visibility = "visible";
	} else if(allMosquitos > 80) {
		playerStatus.setAttribute('class', 'chikungunya');
		playerStatus.textContent = "CHIKUNGUNYA";
	} else if(allMosquitos > 40) {
		playerStatus.setAttribute('class', 'zika');
		playerStatus.textContent = "ZIKA";
	} else if(allMosquitos > 20) {
		playerStatus.setAttribute('class', 'dengue');
		playerStatus.textContent = "DENGUE";
	} else {
		playerStatus.setAttribute('class', 'nada');
		playerStatus.textContent = "NADA";
	}
}

function killMosquito(me) {
	me.parentNode.removeChild(me);
	allMosquitos--;

	value = parseInt(scoreMosquitos.textContent);
	value++;

	scoreMosquitos.textContent = value;
}

function begin() {
	document.getElementById("start").style.visibility = "hidden";

	mosquitoInterval = setInterval(addMosquito, mosquitoFrequency);
	mainInterval = setInterval(startGame, 4000);
}

function startGame() {
	addTrash();

	probs = Math.random();

	if(probs < clockProbability) {
		addClock();
	}

	clearInterval(mosquitoInterval);

	f = mosquitoFrequency - (allTrash.length * 100);
	if(f < 400) {
		f = 400;
	}

	mosquitoInterval = setInterval(addMosquito, f);
}

function restart() {
	document.getElementById("blackCurtains").style.visibility = "hidden";
	document.getElementById("over").style.visibility = "hidden";
	document.getElementById("score").textContent = "0";
	playerStatus.setAttribute('class', 'nada');
	playerStatus.textContent = "NADA";

	while(gameZone.firstChild) {
		gameZone.removeChild(gameZone.firstChild);
	}

	mosquitoFrequency = 2000;
	gameFrequency = 4000;

	probs = 0;
	value = 0;
	allMosquitos = 0;
	clockProbability = 0.1;
	clockEffect = false;

	mosquitoInterval = setInterval(addMosquito, mosquitoFrequency);
	mainInterval = setInterval(startGame, 4000);
}

function addTrash() {
	var left = Math.floor(Math.random() * 85);

	var tire = document.createElement('div');
	tire.setAttribute('class', 'trash tire');
	tire.setAttribute('life', "10");
	tire.setAttribute('onclick', 'destroyTrash(this)');
	tire.style.left = left + "%";
	tire.style.bottom = Math.random() * (1000-900) + 900;

	var lifebar = document.createElement('div');
	lifebar.setAttribute('class', 'lifeBar');

	tire.appendChild(lifebar);
	gameZone.appendChild(tire);

	var inter = setInterval(function() {gravity(tire, inter);}, 25);
}

function destroyTrash(trash) {
	var life = parseInt(trash.getAttribute("life"));
	life--;

	if(life == 0) {
		trash.parentNode.removeChild(trash);
	} else {
		trash.firstChild.style.width = life*10 + "%";
		trash.firstChild.style.visibility = "visible";
		trash.setAttribute('life', life);

		setTimeout(function() {trash.firstChild.style.visibility = "hidden";}, 1000);
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

function addClock() {
	var z = Math.floor(Math.random() * 80);
	var w = Math.floor(Math.random() * 85);

	var clock = document.createElement('div');
	clock.setAttribute('class', 'clock');
	clock.setAttribute('onMouseDown', 'activateClock(this)');
	clock.style.top = z + "%";
	clock.style.left = w + "%";
	gameZone.appendChild(clock);

	setTimeout(function() {clock.parentNode.removeChild(clock);}, 1500);
}

function activateClock(clock) {
	clock.style.visibility = "hidden";
	clockEffect = true;

	clearInterval(mosquitoInterval);
	clearInterval(mainInterval);

	setTimeout(function() {
		clockEffect = false;
		mainInterval = setInterval(startGame, 4000);
	}, 4000);
}