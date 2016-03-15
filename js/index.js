function addMosquito() {
	var x = Math.floor((Math.random() * 50) + 1);
	var y = Math.floor(Math.random() * 100);

	var mosquito = document.createElement('div');
	mosquito.setAttribute('class', 'aedes');
	mosquito.setAttribute('onclick', 'killMosquito(this)');
	mosquito.style.marginTop = x + "%";
	mosquito.style.marginLeft = y + "%";

	document.body.appendChild(mosquito);
}

function killMosquito(me) {
	me.parentNode.removeChild(me);
}

setInterval(function() {
	addMosquito();
}, 2000);
