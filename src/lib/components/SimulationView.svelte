<script>
	import { initializeMasses } from '$lib/scenarios/scenario-factory.js';
	import { physicsConfig } from '$lib/stores/physics-config';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import SimulationCanvas from '$lib/components/SimulationCanvas.svelte';
	import PhysicsSimulation from '$lib/components/PhysicsSimulation.svelte';
	import MassRenderer from '$lib/components/MassRenderer.svelte';

	export let scenario;
	export let n = null;
	export let scenarioMetadata = null;
	$: physicsModel = scenarioMetadata?.physicsModel || 'newtonian';
	$: relativisticFactor = scenarioMetadata?.relativisticFactor;
	$: quantumUncertainty = scenarioMetadata?.quantumUncertainty;
	$: tunnelingProbability = scenarioMetadata?.tunnelingProbability;

	let masses = [];
	let canvas, ctx;
	let centerX, centerY, orbitRadius;
	let initializationError = null;
	let massRenderer;

	$: currentG = $physicsConfig.G;
	let lastInitializedG = null;
	let lastInitializedN = null;
	let lastInitializedScenario = null;

	function resetErrorState() {
		masses = [];
		lastInitializedG = null;
		lastInitializedN = null;
		lastInitializedScenario = null;
	}

	function initializeIfNeeded(nValue) {
		const needsReinit =
			lastInitializedG !== currentG ||
			lastInitializedN !== nValue ||
			lastInitializedScenario !== scenario ||
			masses.length === 0;
		if (needsReinit) {
			masses = initializeMasses(centerX, centerY, orbitRadius, scenario, nValue, currentG);
			lastInitializedG = currentG;
			lastInitializedN = nValue;
			lastInitializedScenario = scenario;
			initializationError = null;
		}
	}

	$: if (canvas && scenarioMetadata) {
		try {
			if (n === null) {
				initializationError = 'Number of bodies is required';
				resetErrorState();
			} else {
				initializeIfNeeded(n);
			}
		} catch (e) {
			initializationError = e.message || 'Failed to initialize simulation';
			resetErrorState();
		}
	}

	$: displayError = initializationError;
</script>

{#if displayError}
	<ErrorDisplay error={displayError} />
{:else}
	<SimulationCanvas bind:canvas bind:ctx bind:centerX bind:centerY bind:orbitRadius />

	<PhysicsSimulation
		{masses}
		{physicsModel}
		{relativisticFactor}
		{quantumUncertainty}
		{tunnelingProbability}
		onUpdate={() => {
			if (massRenderer) {
				massRenderer.triggerRender();
			}
		}}
	/>

	<MassRenderer
		bind:this={massRenderer}
		{ctx}
		{masses}
		{physicsModel}
		{relativisticFactor}
		{quantumUncertainty}
	/>
{/if}

