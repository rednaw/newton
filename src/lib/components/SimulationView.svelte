<script>
	import { initializeMasses } from '$lib/scenarios/scenario-factory.js';
	import { validateN } from '$lib/utils/validation';
	import { physicsConfig } from '$lib/stores/physics-config';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import BackButton from '$lib/components/BackButton.svelte';
	import SimulationCanvas from '$lib/components/SimulationCanvas.svelte';
	import PhysicsSimulation from '$lib/components/PhysicsSimulation.svelte';
	import MassRenderer from '$lib/components/MassRenderer.svelte';

	export let scenario;
	export let n = null;
	export let scenarioMetadata = null;

	let masses = [];
	let canvas, ctx;
	let centerX, centerY, orbitRadius;
	let initializationError = null;
	let massRenderer;

	$: currentG = $physicsConfig.G;
	let lastInitializedG = null;
	let lastInitializedN = null;

	function resetErrorState() {
		masses = [];
		lastInitializedG = null;
		lastInitializedN = null;
	}

	function initializeIfNeeded(nValue) {
		const needsReinit =
			lastInitializedG !== currentG || lastInitializedN !== nValue || masses.length === 0;
		if (needsReinit) {
			masses = initializeMasses(centerX, centerY, orbitRadius, scenario, nValue, currentG);
			lastInitializedG = currentG;
			lastInitializedN = nValue;
			initializationError = null;
		}
	}

	$: if (canvas && scenarioMetadata) {
		try {
			if (scenarioMetadata.requiresN) {
				const nValidation = validateN(n);
				if (!nValidation.valid) {
					initializationError = nValidation.error;
					resetErrorState();
				} else {
					initializeIfNeeded(nValidation.value);
				}
			} else {
				initializeIfNeeded(null);
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
	<BackButton />

	<SimulationCanvas bind:canvas bind:ctx bind:centerX bind:centerY bind:orbitRadius />

	<PhysicsSimulation
		{masses}
		onUpdate={() => {
			if (massRenderer) {
				massRenderer.triggerRender();
			}
		}}
	/>

	<MassRenderer bind:this={massRenderer} {ctx} {masses} />
{/if}
