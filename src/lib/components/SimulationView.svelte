<script>
	import { initializeMasses, getScenarioMetadata } from '$lib/config';
	import { validateN } from '$lib/utils/validation';
	import { physicsConfig } from '$lib/stores/physics-config';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import BackButton from '$lib/components/BackButton.svelte';
	import SimulationCanvas from '$lib/components/SimulationCanvas.svelte';
	import PhysicsSimulation from '$lib/components/PhysicsSimulation.svelte';
	import MassRenderer from '$lib/components/MassRenderer.svelte';

	export let scenario;
	export let n = null;

	let masses = [];
	let canvas, ctx;
	let centerX, centerY, orbitRadius;
	let error = null;
	let scenarioMetadata = null;
	let initializationError = null;
	let massRenderer;

	$: {
		try {
			scenarioMetadata = getScenarioMetadata(scenario);
			error = null;
		} catch (e) {
			error = `Invalid scenario: ${scenario}. Please use a valid scenario.`;
			scenarioMetadata = null;
		}
	}

	$: currentG = $physicsConfig.G;
	let lastInitializedG = null;
	let lastInitializedN = null;

	function resetErrorState() {
		masses = [];
		lastInitializedG = null;
		lastInitializedN = null;
	}

	$: if (canvas && scenarioMetadata && !error) {
		try {
			if (scenarioMetadata.requiresN) {
				const nValidation = validateN(n ?? scenarioMetadata.defaultN);
				if (!nValidation.valid) {
					initializationError = nValidation.error;
					resetErrorState();
				} else {
					const nValue = nValidation.value;
					const needsReinit = lastInitializedG !== currentG || lastInitializedN !== nValue || masses.length === 0;
					if (needsReinit) {
						masses = initializeMasses(centerX, centerY, orbitRadius, scenario, nValue, currentG);
						lastInitializedG = currentG;
						lastInitializedN = nValue;
						initializationError = null;
					}
				}
			} else {
				const nValue = scenarioMetadata.defaultN;
				const needsReinit = lastInitializedG !== currentG || lastInitializedN !== nValue || masses.length === 0;
				if (needsReinit) {
					masses = initializeMasses(centerX, centerY, orbitRadius, scenario, nValue, currentG);
					lastInitializedG = currentG;
					lastInitializedN = nValue;
					initializationError = null;
				}
			}
		} catch (e) {
			initializationError = e.message || 'Failed to initialize simulation';
			resetErrorState();
		}
	}

	$: displayError = error || initializationError;
</script>

{#if displayError}
	<ErrorDisplay error={displayError} />
{:else}
	<BackButton />

	<SimulationCanvas 
		bind:canvas 
		bind:ctx 
		bind:centerX 
		bind:centerY 
		bind:orbitRadius 
	/>

	<PhysicsSimulation {masses} onUpdate={() => {
		if (massRenderer) {
			massRenderer.triggerRender();
		}
	}} />

	<MassRenderer bind:this={massRenderer} {ctx} {masses} />
{/if}

