<script>
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { config, initializeMasses } from '$lib/config';
	import SimulationCanvas from '$lib/components/SimulationCanvas.svelte';
	import PhysicsSimulation from '$lib/components/PhysicsSimulation.svelte';
	import MassRenderer from '$lib/components/MassRenderer.svelte';

	let masses = [];
	let canvas, ctx;
	let width, height, centerX, centerY, orbitRadius;

	$: scenario = $page.params.scenario || 'N';
	$: n = browser ? parseInt($page.url.searchParams.get('n')) || 3 : 3;
	$: if (canvas) {
		masses = initializeMasses(centerX, centerY, orbitRadius, scenario, n);
	}
</script>

<SimulationCanvas 
	bind:canvas 
	bind:ctx 
	bind:width 
	bind:height 
	bind:centerX 
	bind:centerY 
	bind:orbitRadius 
/>

<PhysicsSimulation {masses} onUpdate={(newMasses) => masses = newMasses} />

<MassRenderer {ctx} {masses} /> 