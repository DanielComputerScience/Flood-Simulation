var height = 10;
var length = 20;
var width = 30;
var wVolume = 1800;
var area = height * length;
var wHt = wVolume / area;
var flow = false;
var time = 0;
var flood = true;
var grassH = 4;
var grassW = 300;
var pipeBlock = 1;
var pause = false;
var scolor = ""
var runs = 0
var runState = true



//
//Buttons
//
//Flow Button
function pauseFunc() {
	pause = !pause;
	runState = !runState;
	if (pause == false) {
		runs += 1;
	}
	else {
		addDataToTable();
	}
	
}
function endFunc() {
	pause = !pause;
	runState = !runState;
	flood = true
	if (pause == false) {
		runs += 1;
	}
	else {
		addDataToTable();
	//	wHt = 0;
		wVolume = 0;
		time = 0;
	}


	
}
function startFlow() {
	flow = !flow;
}
flowButton.addEventListener('click', startFlow);


//Pause Button
pauseButton.addEventListener('click', pauseFunc);

//
endButton.addEventListener('click', endFunc);

// Flood Button
function startFlood() {
	flood = !flood;
}
floodButton.addEventListener('click', startFlood);

//
//Load Terrain Button
loadButton.addEventListener('click', fetchTerrain);

const water = document.querySelector('.water');
const grass = document.querySelector('.grass');
const drain = document.querySelector('.drain');
const sroom = document.querySelector('.sroom');
grass.style.height = grassW + 'px';
grass.style.height = grassH + 'px';
drain.style.backgroundColor = "black";

const map = {
  "grid": [
  ]
};
const roomElement = document.getElementById('sroom');

// Check if the element was actually found before proceeding
if (!roomElement) {
	console.error("Error: 'sroom' element not found.");
	// Exit the function if the element doesn't exist
}

const computedStyle = window.getComputedStyle(roomElement);
const gwidth = parseInt(computedStyle.width, 10);
const gheight = parseInt(computedStyle.height, 10);
const rows = gheight / 10;
const columns = gwidth / 40;

let gridH = 0;

for (let i = 0; i < rows; i++) {
	const newRow = []
//	console.log("initial row");
//	console.log(newRow);
	let gridW = 0;
	for (let j = 0; j < columns; j++) {
		const gridElement = document.createElement('div');

		gridElement.classList.add('grid');
		gridElement.style.position = 'absolute';
		gridElement.style.bottom = gridH + 'px';
		gridElement.style.left = gridW + 'px';

		gridElement.id = String(i) + "." + String(j);
//		gridColor();
		roomElement.appendChild(gridElement);
		gridW += 40;
	//	console.log(String(i) + String(j));
		let rNum = Math.floor(Math.random() * 9);
		newRow.push({ "elevation": rNum, "waterLevel": 0, "isDrain": false },);
	}
	gridH += 10;
//	console.log("pushed row ");
//	console.log(newRow);
	map.grid.push(newRow);
}
console.log(map.grid)

//
// Functions
//

// new row Function

function addDataToTable() {
	// 1. Get the table body by its ID
    let tableBody = document.getElementById("tableBody");

    // 2. Create a new row element
    let newRow = tableBody.insertRow();

    // 3. Insert 3 new cells into the row
    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);

    // 4. Set the text inside the cells to your variables
    cell1.textContent = runs;
    cell2.textContent = wHt.toFixed(2); // toFixed(2) keeps it to 2 decimal places
    cell3.textContent = time;
}

// Pipe flow function

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
// 
function gridColor() {
	
//	const element = document.getElementById("0.0");
//	element.style.backgroundColor = "red";
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			//console.log((String(i) + "." + String(j)));
			const element = document.getElementById(String(i) + "." + String(j));
			if (wHt > 150) {
				element.style.backgroundColor = "blue";
			}// over the levees capacity
			else if (wHt > 50) {
				element.style.backgroundColor = "lightblue";
			}


			else if (wHt > 13.8) { 
				element.style.backgroundColor = "teal";
			} // over average rainfall 
			//	cell.style.color = "lightblue"
		}
	}
}

// Wait for the DOM to be fully loaded before running generateMap()
//document.addEventListener('DOMContentLoaded', generateMap);


var grassArea = grassH * grassW;
/*const config = {
	"rainfallRateperStep": 0.3,
	"flowCoefficient": 0.025,
	"totalSteps": 100
};
*/
//function to run continuously at a certain interval
function runTimeStep(grid) {
  const height = grid.length;
  const width = grid[0].length;
  const nextGrid = JSON.parse(JSON.stringify(grid));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = nextGrid[y][x];
      
      // A1. Add rain
      cell.waterLevel += Math.random;

      // A2. Apply drainage (THIS IS YOUR RESEARCH)
      if (cell.isDrain) {
        const drained = Math.min(cell.waterLevel, cell.drainRate);
        cell.waterLevel += drained;
      }
    }
  }
}
console.log(map.grid[0][0]);
setInterval(() => {
	if (pause != true) {
		if (flood == true) {
			wVolume += 100;
		}
		time += 1;
		if (time > 335) {
			flood = false;
		}
		if (wVolume == 0 || wVolume < 0) {
			endFunc;
		}
		if (wHt > 600000){
			endFunc;
		}
		wHt = wVolume / area;
		water.style.height = wHt + 'px';
		pipeFlow();
		if (wVolume > 0) {
			wVolume -= grassArea * .02;
		}
		if (wHt < 1) {
			runState = false;
			endFunc;
		}
		document.querySelector('name').innerText = time + ' hours ' + " " + wHt + ' volume'; 
		gridColor();
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < columns; j++) {
		//	map.grid[i][j]
		}
		}
	//	runTimeStep(grid);
		console.log(wHt);
	}

}, 5);
async function fetchTerrain() {
    const apiKey = "YOUR_API_KEY";
    const url = `${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    // The API might return a 2D array in 'results'
    // We map that to our internal simulation grid
    for (let r = 0; r < 20; r++) {
        for (let c = 0; c < 20; c++) {
            simulationGrid[r][c].elevation = data.results[r][c];
        }
    }
    console.log("New Orleans terrain loaded!");
}


