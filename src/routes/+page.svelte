<script>
	import { config, initializeMasses } from '$lib/config';
	import { goto } from '$app/navigation';

	let physicsParams = {
		G: config.G,
		DT: config.DT,
		SOFTENING: config.SOFTENING
	};

	let nBodies = 3;

	function startSimulation() {
		// Update config with new values
		config.G = physicsParams.G;
		config.DT = physicsParams.DT;
		config.SOFTENING = physicsParams.SOFTENING;
		config.scenario = 'N';
		
		// Navigate to the simulation with N parameter
		goto(`/N?n=${nBodies}`);
	}
</script>

<div class="landing">
	<h1>Newton's N-Body Simulation</h1>
	
	<div class="config-panel">
		<div class="physics-params">
			<h2>Physics Parameters</h2>
			<div class="param-group">
				<label>
					Gravitational Constant (G):
					<input type="number" bind:value={physicsParams.G} min="1" max="1000" step="10">
				</label>
			</div>
			<div class="param-group">
				<label>
					Time Step (DT):
					<input type="number" bind:value={physicsParams.DT} min="0.01" max="1" step="0.01">
				</label>
			</div>
			<div class="param-group">
				<label>
					Softening Parameter:
					<input type="number" bind:value={physicsParams.SOFTENING} min="1" max="1000" step="10">
				</label>
			</div>
		</div>

		<div class="scenario-config">
			<h2>Simulation Configuration</h2>
			<div class="param-group">
				<label>
					Number of Bodies (N):
					<input type="number" bind:value={nBodies} min="2" max="1000" step="1">
				</label>
				<p class="description">All bodies will have equal mass and be arranged in a circle</p>
			</div>
		</div>
	</div>

	<button class="start-button" on:click={startSimulation}>
		Start Simulation
	</button>
</div>

<style>
	.landing {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
		background: #111;
		color: white;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 2rem;
		text-align: center;
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	.config-panel {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		width: 100%;
		max-width: 1200px;
		margin-bottom: 2rem;
	}

	.physics-params, .scenario-config {
		background: #222;
		padding: 1.5rem;
		border-radius: 8px;
	}

	.param-group {
		margin-bottom: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	input[type="number"] {
		background: #333;
		border: 1px solid #444;
		color: white;
		padding: 0.5rem;
		border-radius: 4px;
		width: 100%;
	}

	.description {
		margin: 0.5rem 0 0 0;
		opacity: 0.8;
		font-size: 0.9rem;
	}

	.start-button {
		background: #4CAF50;
		color: white;
		border: none;
		padding: 1rem 2rem;
		font-size: 1.2rem;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.start-button:hover {
		background: #45a049;
	}

	@media (max-width: 768px) {
		.config-panel {
			grid-template-columns: 1fr;
		}
	}
</style>
