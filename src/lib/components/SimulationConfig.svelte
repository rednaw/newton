<script>
	import { onMount } from 'svelte';
	import { physicsConfig } from '$lib/stores/physics-config';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { validatePhysicsParams, validateN } from '$lib/utils/validation';

	export let scenario;
	export let scenarioMetadata;

	let physicsParams = { G: 500, DT: 0.1, SOFTENING: 100 };
	let validationErrors = {};
	let nBodies = 3;
	let initialized = false;
	
	onMount(() => {
		const config = $physicsConfig;
		physicsParams = {
			G: config.G,
			DT: config.DT,
			SOFTENING: config.SOFTENING
		};
	});
	
	$: if (scenarioMetadata && !initialized) {
		nBodies = scenarioMetadata.defaultN;
		initialized = true;
	}

	function startSimulation() {
		if (!scenarioMetadata) return;
		
		validationErrors = {};
		
		const physicsValidation = validatePhysicsParams(physicsParams);
		if (!physicsValidation.valid) {
			validationErrors = physicsValidation.errors;
			return;
		}
		
		if (scenarioMetadata.requiresN) {
			const nValidation = validateN(nBodies);
			if (!nValidation.valid) {
				validationErrors.nBodies = nValidation.error;
				return;
			}
			nBodies = nValidation.value;
		}
		
		physicsConfig.set({
			G: Number(physicsParams.G),
			DT: Number(physicsParams.DT),
			SOFTENING: Number(physicsParams.SOFTENING)
		});
		
		const url = `${base}/${scenario}/sim${scenarioMetadata.requiresN ? `?n=${nBodies}` : ''}`;
		goto(url);
	}
</script>

<div class="landing">
	<h1>{scenario.charAt(0).toUpperCase() + scenario.slice(1)} Simulation Configuration</h1>
	
	<div class="config-panel">
		<div class="physics-params">
			<h2>Physics Parameters</h2>
			<div class="param-group">
				<label>
					Gravitational Constant (G):
					<input 
						type="number" 
						bind:value={physicsParams.G} 
						min="1" 
						max="1000" 
						step="10"
						class:error={validationErrors.G}
					>
					{#if validationErrors.G}
						<span class="error-text">{validationErrors.G}</span>
					{/if}
				</label>
			</div>
			<div class="param-group">
				<label>
					Time Step (DT):
					<input 
						type="number" 
						bind:value={physicsParams.DT} 
						min="0.01" 
						max="1" 
						step="0.01"
						class:error={validationErrors.DT}
					>
					{#if validationErrors.DT}
						<span class="error-text">{validationErrors.DT}</span>
					{/if}
				</label>
			</div>
			<div class="param-group">
				<label>
					Softening Parameter:
					<input 
						type="number" 
						bind:value={physicsParams.SOFTENING} 
						min="1" 
						max="1000" 
						step="10"
						class:error={validationErrors.SOFTENING}
					>
					{#if validationErrors.SOFTENING}
						<span class="error-text">{validationErrors.SOFTENING}</span>
					{/if}
				</label>
			</div>
		</div>

		{#if scenarioMetadata?.requiresN}
			<div class="scenario-config">
				<h2>Simulation Configuration</h2>
				<div class="param-group">
					<label>
						Number of Bodies (N):
						<input 
							type="number" 
							bind:value={nBodies} 
							min="2" 
							max="1000" 
							step="1"
							class:error={validationErrors.nBodies}
						>
						{#if validationErrors.nBodies}
							<span class="error-text">{validationErrors.nBodies}</span>
						{/if}
					</label>
				</div>
			</div>
		{/if}
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
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

	input[type="number"].error {
		border-color: #ff4444;
		background: #3a2222;
	}

	.error-text {
		color: #ff4444;
		font-size: 0.85rem;
		margin-top: 0.25rem;
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

