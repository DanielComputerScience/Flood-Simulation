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
const sroom = document.querySelector('.sroom');
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
// home.js

function generateMap() {
  const roomElement = document.getElementById('sroom');
  
  // Check if the element was actually found before proceeding
  if (!roomElement) {
    console.error("Error: 'sroom' element not found.");
    return; // Exit the function if the element doesn't exist
  }

  const computedStyle = window.getComputedStyle(roomElement);
  const width = parseInt(computedStyle.width, 10);
  const height = parseInt(computedStyle.height, 10);
  const rows = height / 10;
  const columns = width / 40;

  let gridH = 0;

  for (let i = 0; i < rows; i++) {
    let gridW = 0;
    for (let j = 0; j < columns; j++) {
      const gridElement = document.createElement('div');
	
      gridElement.classList.add('grid');
      gridElement.style.position = 'absolute';
      gridElement.style.bottom = gridH + 'px';
      gridElement.style.left = gridW + 'px';
	gridElement.id = String(i) + String(j);
      roomElement.appendChild(gridElement);
      gridW += 40;
	    console.log(i + j);
    }
    gridH += 10;
  }
}

// Wait for the DOM to be fully loaded before running generateMap()
document.addEventListener('DOMContentLoaded', generateMap);


var grassArea = grassH * grassWi;
const config = {
	"rainfallRateperStep": 0.1,
	"flowCoefficient": 0.025,
	"totalSteps": 100
};
const map = {
  "grid": [
    // Row 0
    [
      { "elevation": 10, "waterLevel": 0, "isDrain": false },
      { "elevation": 8,  "waterLevel": 0, "isDrain": false },
      { "elevation": 10, "waterLevel": 0, "isDrain": false }
    ],
    // Row 1
    [
      { "elevation": 10, "waterLevel": 0, "isDrain": false },
      { "elevation": 6,  "waterLevel": 0, "isDrain": true, "drainRate": 0.5 },
      { "elevation": 10, "waterLevel": 0, "isDrain": false }
    ],
    // Row 2
    [
      { "elevation": 10, "waterLevel": 0, "isDrain": false },
      { "elevation": 8,  "waterLevel": 0, "isDrain": false },
      { "elevation": 10, "waterLevel": 0, "isDrain": false }
    ]
  ]
};
function runTimeStep(grid, config) {
  const height = grid.length;
  const width = grid[0].length;
  const nextGrid = JSON.parse(JSON.stringify(grid));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = nextGrid[y][x];
      
      // A1. Add rain
      cell.waterLevel += config.rainfallRatePerStep;

      // A2. Apply drainage (THIS IS YOUR RESEARCH)
      if (cell.isDrain) {
        const drained = Math.min(cell.waterLevel, cell.drainRate);
        cell.waterLevel += drained;
      }
    }
  }
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
	document.querySelector('name').innerText = time + ' seconds ' + " " + wHt + ' pressure'; 
	console.log(wHt);
	
}, 50);


