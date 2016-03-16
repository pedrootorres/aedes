var frequency = 2000;
var checkpoint = 10;
var increment = 6;
var increment2 = 18;
var score = 0;
var value = 0;

function addMosquito() {
	var x = Math.floor(Math.random() * 50);
	var y = Math.floor(Math.random() * 90);

	var mosquito = document.createElement('div');
	mosquito.setAttribute('class', 'aedes');
	mosquito.setAttribute('onclick', 'killMosquito(this)');
	mosquito.style.marginTop = x + "%";
	mosquito.style.marginLeft = y + "%";

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
		interval = setInterval(startGame, frequency);
	}

	console.log("frequency:" + frequency + ", checkpoint:" + checkpoint);
}

var interval = setInterval(startGame, frequency);