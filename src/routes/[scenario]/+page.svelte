<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { getScenarioMetadata } from '$lib/scenarios/scenario-metadata.js';
	import { parseRouteParams } from '$lib/utils/route-params';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import BackButton from '$lib/components/BackButton.svelte';
	import SimulationConfig from '$lib/components/SimulationConfig.svelte';
	import SimulationView from '$lib/components/SimulationView.svelte';

	$: routeParams = parseRouteParams($page, browser);
	$: scenario = routeParams.scenario;
	$: n = routeParams.n;
	$: nError = routeParams.nError;

	$: showSimulation = browser && $page.url.searchParams.get('sim') === 'true';

	let scenarioMetadata = null;
	let scenarioError = null;

	$: {
		try {
			scenarioMetadata = getScenarioMetadata(scenario);
			scenarioError = null;
		} catch (e) {
			scenarioError = `Invalid scenario: ${scenario}. Please use a valid scenario.`;
			scenarioMetadata = null;
		}
	}

	$: viewMode = (() => {
		if (scenarioError || nError) return 'error';
		if (!showSimulation) return 'config';
		if (scenarioMetadata?.requiresN && n === null) return 'config';
		return 'simulation';
	})();

	$: errorMessage = scenarioError || nError;
</script>

{#if viewMode === 'error'}
	<ErrorDisplay error={errorMessage} />
{:else if viewMode === 'config'}
	<BackButton />
	<SimulationConfig {scenario} {scenarioMetadata} />
{:else}
	<SimulationView {scenario} {n} {scenarioMetadata} />
{/if}
