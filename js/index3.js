var gameZone = document.getElementById("gameZone");

var random = new randomNumber();

var mainInterval;

var frame = -2000;

var trashFrequency = 4000;
var mosquitoFrequency = 2000;

var allTrash = [];
var typesTrash = ['tire', 'vaseRed', 'vaseYellow'];

function begin() {
	document.getElementById("start").style.visibility = "hidden";

	mainInterval = setInterval(updateGame, 20);
}

function updateGame() {
	if(frame % trashFrequency == 0) {
		addTrash();
	}

	if(frame % mosquitoFrequency == 0) {
		addMosquito();
	}

	for(var i = 0; i < allTrash.length; i++) {
		var y = parseInt(allTrash[i].style.bottom);
		y-=8;
		allTrash[i].style.bottom = y;
		if(y < 48) {
			allTrash.splice(i, 1);
		}
	}

	frame+=20;
}

function addTrash() {
	// var whichTrash = Math.floor(Math.random() * 3);
	var whichTrash = Math.floor(random.get() * 3);
	
	// var left = Math.floor(Math.random() * 85);
	var left = Math.floor(random.get() * (window.innerWidth-100));

	var tire = document.createElement('div');
	tire.setAttribute('class', 'trash ' + typesTrash[whichTrash]);
	tire.setAttribute('life', "10");
	tire.setAttribute('onclick', 'destroyTrash(this)');
	tire.style.left = left;
	// tire.style.bottom = Math.random() * (1000-900) + 900;
	tire.style.bottom = random.get() * (1000-900) + 900;

	gameZone.appendChild(tire);
	allTrash.push(tire);
}

function addMosquito() {
	// var x = Math.floor(Math.random() * (window.innerHeight-200 - 150) + 150);
	var x = Math.floor(random.get() * (window.innerHeight-200 - 150) + 150);
	// var y = Math.floor(Math.random() * (window.innerWidth-100));
	var y = Math.floor(random.get() * (window.innerWidth-100));

	var mosquito = document.createElement('div');
	mosquito.setAttribute('class', 'aedes');
	mosquito.setAttribute('onMouseDown', 'killMosquito(this)');
	mosquito.style.top = x;
	mosquito.style.left = y;

	gameZone.appendChild(mosquito);
}

function randomNumber() {
	this.last = Date.now() % 100;

	this.get = function() {
		this.last = (this.last * 32719 + 3) % 32749;
		return (this.last % 100) / 100;
	}
};