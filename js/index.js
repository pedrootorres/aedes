var gameZone = document.getElementById("gameZone");
var probs = 0;
var frequency = 2000;
var checkpoint = 10;
var increment = 6;
var increment2 = 18;
var score = document.getElementById("score");
var fakeScore = 0;
var value = 0;
var allMosquitos = document.getElementsByClassName("aedes");
var playerStatus = document.getElementById("disease");
var interval;
var clockProbability = 0.1;
var clockEffect = false;
var x, y;
var mosquito;

function addMosquito() {
	x = Math.floor(Math.random() * 80);
	y = Math.floor(Math.random() * 85);

	mosquito = document.createElement('div');
	mosquito.setAttribute('class', 'aedes');
	mosquito.setAttribute('onMouseDown', 'killMosquito(this)');
	mosquito.style.top = x + "%";
	mosquito.style.left = y + "%";

	gameZone.appendChild(mosquito);
}

function killMosquito(me) {
	me.parentNode.removeChild(me);

	value = parseInt(score.textContent);
	value++;

	if(!clockEffect) {
		fakeScore++;
	}

	score.textContent = value;

	if(fakeScore > checkpoint) {
		checkpoint = 50/(10 - increment);
		increment = increment + (10 - increment)/3;

		frequency = 2000 - 1000/(20 - increment2);
		increment2 = increment2 + (19.5 - increment2)/3;

		clearInterval(interval);

		if(frequency < 0) {
			frequency = 100;
		}

		addTire();
		addTire();
		addTire();
		addTire();

		interval = setInterval(startGame, frequency);
	}
}

function begin() {
	interval = setInterval(startGame, frequency);

	document.getElementById("start").style.visibility = "hidden";
}

function startGame() {
	addMosquito();

	probs = Math.random();

	if(probs < clockProbability) {
		addClock();
	}

	if(allMosquitos.length > 100) {
		clearInterval(interval);
		document.getElementById("blackCurtains").style.visibility = "visible";
		document.getElementById("finalScore").textContent = document.getElementById("score").textContent;
		document.getElementById("over").style.visibility = "visible";
	} else if(allMosquitos.length > 80) {
		playerStatus.setAttribute('class', 'chikungunya');
		playerStatus.textContent = "CHIKUNGUNYA";
	} else if(allMosquitos.length > 40) {
		playerStatus.setAttribute('class', 'zika');
		playerStatus.textContent = "ZIKA";
	} else if(allMosquitos.length > 20) {
		playerStatus.setAttribute('class', 'dengue');
		playerStatus.textContent = "DENGUE";
	} else {
		playerStatus.setAttribute('class', 'nada');
		playerStatus.textContent = "NADA";
	}
}

function restart() {
	document.getElementById("blackCurtains").style.visibility = "hidden";
	document.getElementById("over").style.visibility = "hidden";
	document.getElementById("score").textContent = "0";
	playerStatus.setAttribute('class', 'nada');
	playerStatus.textContent = "NADA";

	allMosquitos = document.getElementById('gameZone');

	while(allMosquitos.firstChild) {
		allMosquitos.removeChild(allMosquitos.firstChild);
	}

	frequency = 2000;
	checkpoint = 10;
	increment = 6;
	increment2 = 18;
	score = 0;
	fakeScore = 0;
	value = 0;
	allMosquitos = 0;
	clockProbability = 0.1;
	clockEffect = false;

	interval = setInterval(startGame, frequency);			
}

function addTire() {
	var left = Math.floor(Math.random() * 85);

	var tire = document.createElement('div');
	tire.setAttribute('class', 'tire');
	tire.style.left = left + "%";
	tire.style.bottom = Math.random() * (1000-900) + 900;

	gameZone.appendChild(tire);

	var inter = setInterval(function() {gravity(tire, inter);}, 25);
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

	clearInterval(interval);

	setTimeout(function() {
		clockEffect = false;
		interval = setInterval(startGame, frequency);
	}, 4000);
}