// --- 1. Load your JSON files ---
// In a real app, you'd use fetch() to load these from your server.
// We'll just define them as objects for this example.

const config = {
  "rainfallRatePerStep": 0.1, // 0.01 meters of rain per step
  "flowCoefficient": 0.025,      // 25% of the difference flows per step
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

// --- 2. The Simulation Logic ---

/**
 * This is the main function you would call in a loop.
 * It simulates one "tick" of time.
 */
function runTimeStep(grid, config) {
	const height = grid.length;
	const width = grid[0].length;

	// We need to write changes to a *new* grid to avoid
	// one cell's change affecting its neighbor in the *same* step.
	// This is a "deep copy" of the grid state.
	const nextGrid = JSON.parse(JSON.stringify(grid));

	// --- STEP A: RAINFALL & DRAINAGE ---
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const cell = nextGrid[y][x];

			// A1. Add rain
			cell.waterLevel += config.rainfallRatePerStep;

			// A2. Apply drainage (THIS IS YOUR RESEARCH)
			if (cell.isDrain) {
				const drained = Math.min(cell.waterLevel, cell.drainRate);
				cell.waterLevel -= drained;
			}
		}
	}

	// --- STEP B: WATER FLOW (THE HARD PART) ---
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const currentCell = grid[y][x]; // Read from the *original* grid
			const nextCell = nextGrid[y][x]; // Write to the *new* grid

			const totalHeight = currentCell.elevation + currentCell.waterLevel;

			// Define neighbors (check for map edges)
			const neighbors = [];
			if (y > 0) neighbors.push(grid[y - 1][x]); // North
			if (y < height - 1) neighbors.push(grid[y + 1][x]); // South
			if (x > 0) neighbors.push(grid[y][x - 1]); // West
			if (x < width - 1) neighbors.push(grid[y][x + 1]); // East

			for (const neighbor of neighbors) {
				const neighborTotalHeight = neighbor.elevation + neighbor.waterLevel;

				// If our cell is higher than the neighbor
				if (totalHeight > neighborTotalHeight) {
					const heightDifference = totalHeight - neighborTotalHeight;

					// Calculate how much water to move
					// This simple rule moves 25% of the "excess" water
					let flowAmount = heightDifference * config.flowCoefficient;

					// Don't flow more water than we have
					flowAmount = Math.min(flowAmount, nextCell.waterLevel);

					// This logic is simplified. A real model would distribute
					// the flow among all lower neighbors.

					// Update the *next* grid state
					nextCell.waterLevel -= flowAmount;

					// Note: This is an imperfect flow model, as the neighbor's
					// water level isn't updated *at the same time*.
					// A better model would calculate all flows first, then apply them.
					// But this gives you the basic idea.
				}
			}
		}
	}

	// Return the new state of the world for the next step
	return nextGrid;
}

// --- 3. Running the Simulation ---
console.log("--- STARTING STATE ---");
console.log(map.grid[1][1].waterLevel); // The drain cell

let currentGrid = map.grid;
for (let i = 0; i < config.totalSteps; i++) {
	currentGrid = runTimeStep(currentGrid, config);

	if (i % 10 === 0) {
		console.log(`Step ${i}: Drain cell water level: ${currentGrid[1][1].waterLevel.toFixed(2)}`);
	}
}

console.log("--- FINAL STATE ---");
console.log(currentGrid[1][1]); // See the final water level in the drain
console.log(currentGrid[0][1]); // See the final water level on the slope
