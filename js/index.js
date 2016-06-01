window.onload = function() {
	swal({
		title: "#ZikaZero",
		customClass: "startSwal",
		allowEscapeKey: false,
		allowOutsideClick: false,
		text: "Você está pronto para começar o combate contra o mosquito <i>Aedes aegypti</i>? Não vai ficar doente, hein? Clique em <b><i>Jogar</i></b> para começar ou em <b><i>Instruções</i></b> para aprender os controles!",
		showCancelButton: true,
		confirmButtonText: "Jogar",
		cancelButtonText: "Instruções"
	}).then(function(isConfirm) {
		if(isConfirm) {
			begin();
		} else {
			swal({
				title: "Instruções",
				customClass: "instructionsSwal",
				allowEscapeKey: false,
				allowOutsideClick: false,
				confirmButtonText: "Jogar",
				type: "question",
				html:
					'<div>' +
						'<h3>Objetivo:</h3>' +
						'<p>Seu objetivo é vencer o combate contra o <i>Aedes aegypti</i> e para isso você deve lembrar que não adianta apenas matar o mosquito! Você precisa <b>destruir todos os focos</b> para evitar que ele nasça. São 5 fases: destrua todos os focos para passar para a próxima fase mas, ao mesmo tempo, não deixe que o mosquito te pique. Você só tem 4 chances! Quanto mais rápido você conseguir, melhor!</p>' +
						'<h3>Controles:</h3>' +
						'<p>Cada arma tem a sua função. Selecione ela para destruir um foco específico</p>' +
						'<div class="weaponsInstructions">' +
							'<div class="racketImage">' +
								'<img src="img/racket_small_icon.png" alt=""/>' +
								'<p>Use a raquete para matar os mosquitos. <b>Tecla de atalho: 1</b></p>' +
							'</div>' +
							'<div class="broomImage">' +
								'<img src="img/broom/broom_broom-1.png" alt=""/>' +
								'<p>Use a vassoura para limpar o lixo. <b>Tecla de atalho: 2</b></p>' +
							'</div>' +
							'<div class="racketImage">' +
								'<img src="img/shovel.png" alt=""/>' +
								'<p>Use a pá para colocar areia no vaso de planta. <b>Tecla de atalho: 3</b></p>' +
							'</div>' +
							'<div class="racketImage">' +
								'<img src="img/hand.png" alt=""/>' +
								'<p>A mão fecha caixas d\'água e tirar água dos pneus. <b>Tecla de atalho: 4</b></p>' +
							'</div>' +
						'</div>' +
						'<h3>Arma especial:</h3>' +
						'<p>Sua arma especial é o <b>repelente</b>. Ele pode aparecer na tela por poucos segundos. Seja rápido e colete ele. Para usá-lo selecione-o nas suas armas. O repelente mata todos os mosquitos que existem na tela! Mas seja sábio na hora de usar ele. <b>Tecla de atalho: 5</b></p>' +
						'<img class="repellentIcon" src="img/spray/spray_spray_0.png" alt="" />' +
					'</div>'
			}).then(function(isConfirm) {
				begin();
			});

			document.getElementsByClassName('instructionsSwal')[0].scrollTop = 0;
		}
	});
	
	document.getElementsByClassName('startSwal')[0].scrollTop = 0;
};

var gameZone = document.getElementById("gameZone");
var scoreMosquitos = document.getElementById("scoreMosquitos");
var scoreSource = document.getElementById("scoreSource");
var repellentQty = document.getElementById("repellentQty");
var personLeft = document.getElementById("person").getBoundingClientRect().left;
var symptomStatus = document.getElementById("symptom");

var random = new randomNumber();

var mainInterval;

var stopGame = false;
var pause = false;

var frame;
var trashFrequency;
var mosquitoFrequency;
var intervalFrequency = 20;

var repellentProbability = 0.10;

var amountOfTrash;
var currentLevel = 1;

var duration;

// var typesTrash = ['tire', 'vaseRed', 'vaseYellow', 'garbage', 'waterTank'];
var typesTrash = ['tire', 'vaseRed', 'vaseYellow', 'garbage'];

var diseasesAndSymptoms = [
							['Dengue', 'Febre alta', 'Dor de cabeça', 'Dor no corpo'],
							['Zika', 'Febre baixa', 'Coceira', 'Manchas na Pele'],
							['Chikungunya', 'Febra alta', 'Dor muscular', 'Inchaço nas Articulações']
						  ];

var currentDisease;
var currentSymptom;

/*
* 0 = racket
* 1 = broom
* 2 = shovel
* 3 = hand
*/
var weapon = 0;



function begin() {
	currentDisease = Math.floor(random.get() * 3);
	currentSymptom = 0;
	duration = new Date().getTime() / 1000;
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
		victoryGameOver();
		return;
	}

	for(var i = 0; i < amountOfTrash; i++) {
		addTrash();
	}

	swal ({
		title: "Fase " + lvl,
		customClass: "swalCountdown",
		text: "3",
		timer: 3000,
		width: 200,
		showConfirmButton: false,
		allowEscapeKey: false,
		allowOutsideClick: false
	}).then(function() {
		stopGame = false;
		gameZone.style.cursor = "url('img/racket_mouse.png') 25 25, auto";
		mainInterval = setInterval(updateGame, 20);
	});

	var countdown = 3;
	var countdownInterval = setInterval(function() {
		if(countdown < 1) {
			clearInterval(countdownInterval);
		}

		countdown--;
		document.getElementsByClassName("swalCountdown")[0].children[7].textContent = countdown;
	}, 1000);
}

function updateGame() {
	if(frame % trashFrequency == 0 && frame > 0) {
		addTrash();
		amountOfTrash++;

		changeMosquitoFrequency(-100);
	}

	if(frame % mosquitoFrequency == 0 && frame > 0) {
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

function resetGame() {
	currentLevel = 1;
	currentDisease = Math.floor(random.get() * 3);
	currentSymptom = 0;
	symptomStatus.textContent = "Nenhum";
	repellentQty.textContent = "x 0";

	while(gameZone.children[0]) {
		gameZone.removeChild(gameZone.children[0]);
	}

	scoreSource.textContent = "0";
	scoreMosquitos.textContent = "0";

	duration = new Date().getTime() / 1000;
	nextLevel(currentLevel);
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
	repellent.setAttribute('src', 'img/spray/spray_spray_1.png');
	repellent.setAttribute('onclick', 'increaseRepellent(this)');
	repellent.style.top = x;
	repellent.style.left = y;

	gameZone.appendChild(repellent);

	setTimeout(function() {
		if(repellent.parentNode)
			repellent.parentNode.removeChild(repellent);
	}, 2500);
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
		while(allMosquitos.length != 0) {
			allMosquitos[0].click();
		}

		newSetInterval(updateGame, intervalFrequency);
	}
}

function addTrash() {
	var whichTrash = Math.floor(random.get() * typesTrash.length);
	var left = Math.floor(random.get() * (window.innerWidth-100));

	var trash = document.createElement('div');
	trash.setAttribute('class', 'trash ' + typesTrash[whichTrash]);
	trash.setAttribute('life', 5);
	trash.setAttribute('type', whichTrash);
	trash.setAttribute('onclick', 'destroyTrash(this)');
	trash.style.left = left;
	trash.style.bottom = random.get() * (1000-900) + 900;

	gameZone.appendChild(trash);

	var g = setInterval(function() {
		gravity(trash, g);
	}, 25);
}

var changeAnimation = true;
function destroyTrash (t) {
	var rightWeapon = false;

	if(weapon == 1) {
		if(t.getAttribute('type') == 3) {
			rightWeapon = true;
			if(changeAnimation) {
				gameZone.style.cursor = "url('img/broom/broom_mouse_click-1.png') 25 50, auto";
				changeAnimation = !changeAnimation;
			} else {
				gameZone.style.cursor = "url('img/broom/broom_mouse_click-2.png') 25 50, auto";
				changeAnimation = !changeAnimation;
			}
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
	this.mosquito.style.top = x;
	this.mosquito.style.left = -100;

	gameZone.appendChild(this.mosquito);

	var probs = random.get();
	this.speed;

	if(probs < 0.05) {
		this.speed = 8;
		this.mosquito.setAttribute('class', 'aedes veryFast');
	} else if(probs < 0.15) {
		this.speed = 6;
		this.mosquito.setAttribute('class', 'aedes fast');
	} else if(probs < 0.40) {
		this.speed = 1;
		this.mosquito.setAttribute('class', 'aedes verySlow');
	} else if(probs < 0.80) {
		this.speed = 3;
		this.mosquito.setAttribute('class', 'aedes slow');
	} else if(probs < 1) {
		this.speed = 4;
		this.mosquito.setAttribute('class', 'aedes normal');
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

	if(!pause) {
		mosquito.style.left = left;

		if(left > personLeft) {
			collision(me);
		} else if(stopGame) {
			me.stopFlying();
		}
	}
}

function collision(me) {
	stopGame = true;
	me.stopFlying();

	clearInterval(mainInterval);
	addNewSymptom();	
}

function killMosquito(me) {
	if(weapon == 0) {
		me.mosquito.parentNode.removeChild(me.mosquito);
		me.stopFlying();

		value = parseInt(scoreMosquitos.textContent);
		value++;

		scoreMosquitos.textContent = value;
	}
}

function addNewSymptom() {
	currentSymptom++;

	if(currentSymptom < diseasesAndSymptoms[currentDisease].length) {
		symptomStatus.textContent = diseasesAndSymptoms[currentDisease][currentSymptom];
		showWarning();
	} else {
		gameOver();
	}
}

function showWarning() {
	swal({
		title: "Você foi picado!",
		allowOutsideClick: false,
		allowEscapeKey: false,
		html:
			'<p>Ah não! Você foi picado e está com um novo sintoma! Tome cuidado e lembre-se: não deixe que os mosquitos te piquem.</p>' +
			'<p>Você tem mais ' + (diseasesAndSymptoms[currentDisease].length - currentSymptom) + ' chances!</p>',
		confirmButtonText: "Continuar"
	}).then(function(isConfirm) {
		continueGame();
	});
}

function continueGame() {
	while(gameZone.children[0]) {
		gameZone.children[0].parentNode.removeChild(gameZone.children[0]);
	}

	nextLevel(currentLevel);
}

function victoryGameOver() {
	var currentTime = new Date().getTime() / 1000;
	duration = currentTime - duration;

	var minutes = Math.floor(duration / 60);
	var seconds = Math.floor(duration % 60);

	swal({
		title: "PARABÉNS",
		customClass: 'gameOverAlert',
		html: '<p>Você sobreviveu ao ataque de mosquitos e, o mais importante, conseguiu destruir todos os focos do <i>Aedes aegypti</i>! Excelente trabalho!</p>' +
			'<p>Agora que você já fez a sua parte, converse com seus vizinhos para que eles também ajudem no combate. Lembre eles que não adianta apenas matar o mosquito; Nós não podemos deixar ele nascer. Isso depende de todos! E são simples ações que podem acabar com os focos.</p>' +
			'<h3>Como se prevenir</h3>' +
			'<div id="prevention">' +
				'<div class="waterTankImage">' +
					'<img src="img/water_tank_icon.png" alt=""/>' +
					'<p>Mantenha bem tampados: caixas, tonéis e barris de água.</p>' +
				'</div>' +
				'<div class="vaseImage">' +
					'<img src="img/vase_icon.png" alt=""/>' +
					'<p>Encha os pratinhos ou vasos de planta com areia até a borda.</p>' +
				'</div>' +
			'</div>' +
			'<p>Se for guardar pneus velhos em casa, retire toda a água e mantenha-os em locais cobertos, protegidos da chuva. Não se esqueça também de <b>não</b> jogar lixo em terrenos baldios! Veja outras ações que você deve seguir para ajudar no combate <a href="http://www.saude.ba.gov.br/novoportal/index.php?option=com_content&view=article&id=9345%3Aacoes-para-eliminar-os-focos-do-mosquito-aedes-aegypt&catid=25%3Aorientacao-e-prevencao&Itemid=25" target="_blank">clicando aqui.</a></p>' +
			'<h3>Sua pontuação</h3>' +
			'<p>Você mantou <b>' + scoreMosquitos.textContent + '</b> mosquitos</p>' +
			'<p>e destruiu <b>' + scoreSource.textContent + '</b> focos</p>' +
			'<p>Tudo isso em <b>' + minutes + 'm' + seconds + 's</b>!</p>' +
			'<p>Consegue fazer ainda melhor? Compartilhe o jogo e desafie seus amigos!</p>' +
			'<div class="shareFacebook"><img class="fbWhite" src="img/fb_white.png" alt="" /><a href="#" onclick="shareOnFacebook('+scoreMosquitos.textContent+','+scoreSource.textContent+','+minutes+','+seconds+')">Compartilhe</a></div>' +
			'<h3>Fique por dentro!</h3>' +
			'<div id="stayTuned">' +
				'<div class="facebook">' +
					'<a href="http://facebook.com/minsaude" target="_blank"><img src="img/fb_icon.jpg" alt=""/></a>' +
					'<p>Curta a página do <i>Ministério da Saúde</i> no Facebook</p>' +
				'</div>' +
				'<div class="website">' +
					'<a href="http://combateaedes.saude.gov.br/" target="_blank"><img src="img/combatedengue.png" alt=""/></a>' +
					'<p>Site oficial do Combate ao Mosquito</p>' +
				'</div>' +
				'<div class="disqueSaude">' +
					'<img src="img/disquesaude.jpg" alt=""/>' +
					'<p>Para mais informações sobre as doenças</p>' +
				'</div>' +
			'</div>',
		confirmButtonText: "Jogar novamente",
		allowEscapeKey: false,
		allowOutsideClick: false,
	}).then(function(isConfirm) {
		if(isConfirm) {
			resetGame();
		}
	});

	document.getElementsByClassName('gameOverAlert')[0].scrollTop = 0;
}

function shareOnFacebook(scoreMosquitos, scoreSource, minutes, seconds) {
	var ttl;
	var dscrptn = "Eu me juntei ao combate contra o Aedes aegypti e estou fazendo" +
					" minha parte destruindo os focos do mosquito! Ajude você também!";
	if(currentLevel == 6) {
		ttl = 'Eu matei ' + scoreMosquitos + ' mosquitos, destruí ' + scoreSource + 
			' focos e zerei o jogo! Quero ver você conseguir também!';
	} else {
		ttl = "Eu matei " + scoreMosquitos + " mosquitos, destruí " + scoreSource +
			" focos e cheguei na fase " + currentLevel + " antes de pegar " +
			diseasesAndSymptoms[currentDisease][0] + ". Consegue fazer melhor?";
	}

	FB.ui({
		method: 'share',
		title: ttl,
		description: dscrptn,
		picture: "https://rawgit.com/pedrootorres/aedes/master/img/mosquitos/mosquitos_mosquito_0.png",	
  		href: 'https://rawgit.com/pedrootorres/aedes/master/index.html',
		hashtag: "#ZikaZero",
		caption: "bit.ly/ZIKAZERO",
	}, function(response){});
}

function gameOver() {
	var currentTime = new Date().getTime() / 1000;
	duration = currentTime - duration;

	var minutes = Math.floor(duration / 60);
	var seconds = Math.floor(duration % 60);

	var symptomsText;

	if(currentDisease == 0) {
		symptomsText = 'O primeiro sintoma da Dengue é a febre alta, entre 39° e 40°C. Tem início repentino e geralmente dura de 2 a 7 dias, acompanhada de dor de cabeça, dores no corpo e articulações, prostração, fraqueza, dor atrás dos olhos, erupção e coceira no corpo. Pode haver perda de peso, náuseas e vômitos.';
	} else if(currentDisease == 1) {
		symptomsText = 'A Zika tem como principal sintoma o exantema (erupção na pele) com coceira, febre baixa (ou ausência de febre), olhos vermelhos sem secreção ou coceira, dor nas articulações, dor nos músculos e dor de cabeça. Normalmente os sintomas desaparecem após 3 a 7 dias.'
	} else {
		symptomsText = 'A Chikungunya apresenta sintomas como febre alta, dor muscular e nas articulações, dor de cabeça e exantema (erupção na pele). Os sinais costumam durar de 3 a 10 dias.'
	}

	swal({
		title: "FIM DE JOGO",
		customClass: 'gameOverAlert',
		html: '<p>Que pena! Você não conseguiu eliminar todos os focos e agora não está se sentindo bem depois desse ataque de mosquitos. Esses são os sintomas que você tem:</p>' +
			'<ul id="symptomsList">' +
				'<li>' + diseasesAndSymptoms[currentDisease][1] + '</li>' +
				'<li>' + diseasesAndSymptoms[currentDisease][2] + '</li>' +
				'<li>' + diseasesAndSymptoms[currentDisease][3] + '</li>' +
			'</ul>' +
				'<p>Provavelmente você está com <b>' + diseasesAndSymptoms[currentDisease][0].toUpperCase() + '</b>! ' +
				symptomsText +
				'<p>Consegue fazer melhor? Compartilhe o jogo e desafie seus amigos!</p>' +
				'<div class="shareFacebook"><img class="fbWhite" src="img/fb_white.png" alt="" /><a href="#" onclick="shareOnFacebook('+scoreMosquitos.textContent+','+scoreSource.textContent+','+minutes+','+seconds+')">Compartilhe</a></div>' +
				'<p>Saiba mais sobre essa e outras doenças transmitidas pelo mosquito <i>Aedes aegypti</i> <a href="http://combateaedes.saude.gov.br/sintomas" target="_blank">clicando aqui</a></p>' +
				'<h3>Como se prevenir</h3>' +
				'<p>Não adianta apenas matar o mosquito; Você não pode deixar ele nascer. E isso depende de todos! Ações simples podem acabar com os focos. Faça a sua parte!</p>' +
				'<div id="prevention">' +
					'<div class="waterTankImage">' +
						'<img src="img/water_tank_icon.png" alt=""/>' +
						'<p>Mantenha bem tampados: caixas, tonéis e barris de água.</p>' +
					'</div>' +
					'<div class="vaseImage">' +
						'<img src="img/vase_icon.png" alt=""/>' +
						'<p>Encha os pratinhos ou vasos de planta com areia até a borda.</p>' +
					'</div>' +
				'</div>' +
				'<p>Se for guardar pneus velhos em casa, retire toda a água e mantenha-os em locais cobertos, protegidos da chuva. Não se esqueça também de <b>não</b> jogar lixo em terrenos baldios! Veja outras ações que você deve seguir para ajudar no combate <a href="http://www.saude.ba.gov.br/novoportal/index.php?option=com_content&view=article&id=9345%3Aacoes-para-eliminar-os-focos-do-mosquito-aedes-aegypt&catid=25%3Aorientacao-e-prevencao&Itemid=25" target="_blank">clicando aqui.</a></p>' +
				'<h3>Tratamento</h3>' +
				'<p>Os sintomas da Dengue, Zika e Chikungunya podem ser parecidos, mas o tratamento é diferente para cada doença. Vá ao posto de saúde se estiver com os sintomas. <b>Evite a automedicação</b>.</p>' +
				'<h3>Fique por dentro!</h3>' +
				'<div id="stayTuned">' +
					'<div class="facebook">' +
						'<a href="http://facebook.com/minsaude" target="_blank"><img src="img/fb_icon.jpg" alt=""/></a>' +
						'<p>Curta a página do <i>Ministério da Saúde</i> no Facebook</p>' +
					'</div>' +
					'<div class="website">' +
						'<a href="http://combateaedes.saude.gov.br/" target="_blank"><img src="img/combatedengue.png" alt=""/></a>' +
						'<p>Site oficial do Combate ao Mosquito</p>' +
					'</div>' +
					'<div class="disqueSaude">' +
						'<img src="img/disquesaude.jpg" alt=""/>' +
						'<p>Para mais informações sobre as doenças</p>' +
					'</div>' +
				'</div>',
		confirmButtonText: "Jogar novamente",
		allowEscapeKey: false,
		allowOutsideClick: false,
	}).then(function(isConfirm) {
		if(isConfirm) {
			resetGame();
		}
	});

	document.getElementsByClassName('gameOverAlert')[0].scrollTop = 0;
}

function changeWeapon(w) {
	weapon = parseInt(w);

	if(weapon == 0) {
		gameZone.style.cursor = "url('img/racket_mouse.png') 25 25, auto"
	} else if(weapon == 1) {
		gameZone.style.cursor = "url('img/broom/broom_mouse-1.png') 25 50, auto";
	} else if(weapon == 2) {
		gameZone.style.cursor = "url('img/shovel_mouse.png') 25 25, auto";
	} else {
		gameZone.style.cursor = "url('img/hand_mouse.png') 25 25, auto";
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

window.addEventListener("keydown", function(e){
	if(e.keyCode == 49) {
		changeWeapon(0);
	} else if(e.keyCode == 50) {
		changeWeapon(1);
	} else if(e.keyCode == 51) {
		changeWeapon(2);
	} else if(e.keyCode == 52) {
		changeWeapon(3);
	} else if(e.keyCode == 53) {
		useRepellent();
	}
});

function pauseGame() {
	document.getElementById("pauseIcon").textContent = "\u25ba";
	pause = true;
	clearInterval(mainInterval);

	swal ({
		title: "Jogo em pausa",
		html: "<p>Ideia e desenvolvimento por: <b>Pedro Torres</b></p>" +
			'<p>Images: <b>Bruno Soares</b></p>' +
			'Projeto em código aberto no <a style="text-decoration:none" href="https://github.com/pedrootorres/aedes">GitHub <img src="img/github-icon.png" width="20px" alt="" /></a>',
		allowEscapeKey: false,
		allowOutsideClick: false,
		confirmButtonText: "Continuar"
	}).then(function(isConfirm) {
		if(isConfirm) {
			unpauseGame();
		}
	});
}

function unpauseGame() {
	document.getElementById("pauseIcon").textContent = "\u2590\u00a0\u258c";
	pause = false;
	mainInterval = setInterval(updateGame, 20);
}