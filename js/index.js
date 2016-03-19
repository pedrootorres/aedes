var frequency = 2000;
var checkpoint = 10;
var increment = 6;
var increment2 = 18;
var score = 0;
var value = 0;
var allMosquitos = 0;
var playerStatus = document.getElementById("disease");

function addMosquito() {
	var x = Math.floor(Math.random() * 80);
	var y = Math.floor(Math.random() * 85);

	var mosquito = document.createElement('div');
	mosquito.setAttribute('class', 'aedes');
	mosquito.setAttribute('onclick', 'killMosquito(this)');
	mosquito.style.top = x + "%";
	mosquito.style.left = y + "%";

	document.getElementById("gameZone").appendChild(mosquito);
}

function killMosquito(me) {
	me.parentNode.removeChild(me);
	score = document.getElementById("score");
	value = parseInt(score.textContent);
	value++;

	score.textContent = value;
}

function startGame() {
	addMosquito();

	score = document.getElementById("score");
	value = parseInt(score.textContent);

	if(value > checkpoint) {
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

	allMosquitos = document.getElementsByClassName("aedes").length;

	if(allMosquitos > 100) {
		clearInterval(interval);
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

var interval = setInterval(startGame, frequency);

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
	value = 0;
	allMosquitos = 0;

	interval = setInterval(startGame, frequency);			
}

function addTire() {
	var left = Math.floor(Math.random() * 85);

	var tire = document.createElement('div');
	tire.setAttribute('class', 'tire');
	tire.style.left = left + "%";
	tire.style.bottom = Math.random() * (1000-900) + 900;

	document.getElementById("gameZone").appendChild(tire);

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