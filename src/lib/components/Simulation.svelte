<script>
	import SimulationView from '$lib/components/SimulationView.svelte';
	import SimulationConfig from '$lib/components/SimulationConfig.svelte';

	export let scenario;
	export let n = null;
	export let scenarioMetadata = null;
</script>

<SimulationView {scenario} {n} {scenarioMetadata} />
<SimulationConfig {scenario} {scenarioMetadata} {n} />

