<script>
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { getScenarioMetadata } from '$lib/scenarios/scenario-metadata.js';
	import { parseRouteParams } from '$lib/utils/route-params';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import Simulation from '$lib/components/Simulation.svelte';

	let scenarioMetadata = null;
	let scenarioError = null;

	$: {
		try {
			scenarioMetadata = getScenarioMetadata($page.params.scenario || 'N');
			scenarioError = null;
		} catch (e) {
			scenarioError = `Invalid scenario: ${$page.params.scenario || 'N'}. Please use a valid scenario.`;
			scenarioMetadata = null;
		}
	}

	$: routeParams = parseRouteParams($page, browser, scenarioMetadata);
	$: scenario = routeParams.scenario;
	$: n = routeParams.n;
	$: nError = routeParams.nError;

	$: errorMessage = scenarioError || nError;
</script>

{#if errorMessage}
	<ErrorDisplay error={errorMessage} />
{:else if scenarioMetadata}
	<Simulation {scenario} {n} {scenarioMetadata} />
{/if}
