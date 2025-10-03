var height = 10;
var length = 20;
var width = 30;
var wVolume = 1800;
var area = height * length;
var wHt = wVolume / area;
var flow = true;
var time = 0;
var flood = true;
var grassH = 4;
var grassW = 300;
var pipeBlock = 1;
function startFlow() {
	flow = !flow;
}
flowButton.addEventListener('click', startFlow);
function startFlood() {
	flood = !flood;
}
floodButton.addEventListener('click', startFlood);
const water = document.querySelector('.water');
const grass = document.querySelector('.grass');
const drain = document.querySelector('.drain');
grass.style.height = grassW + 'px';
grass.style.height = grassH + 'px';
drain.style.backgroundColor = "black";
function pipeFlow() {
	if (wHt >= 60) {
		if (wHt >= 260 && pipeBlock > 10) {
			pipeBlock -= 3;

		}
		if (flow == true && pipeBlock < 6){
			wVolume -= 120 / pipeBlock;
			console.log('block = ' + pipeBlock);
		}
		if (pipeBlock > 4) {
			drain.style.backgroundColor = "green";
		}
		pipeBlock += Math.random() / 50;

	}
}
var grassArea = grassH * grassW;
setInterval(() => {
	if (flood == true) {
		wVolume += 100;
	}
	time += 1;
	wHt = wVolume / area;
	water.style.height = wHt + 'px';
	pipeFlow();
	if (wVolume > 0) {
		wVolume -= grassArea * .02;
	}
	document.querySelector('name').innerText = time + ' seconds ' + wHt + ' pressure'; 
	console.log(wHt);
	
}, 50);
