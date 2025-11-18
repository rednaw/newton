<script>
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { getScenarioMetadata } from '$lib/scenarios/scenario-metadata.js';
	import { parseRouteParams } from '$lib/utils/route-params';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import Simulation from '$lib/components/Simulation.svelte';
	import { DEFAULT_N } from '$lib/scenarios/scenario-metadata.js';

	$: routeParams = parseRouteParams($page, browser);
	$: scenario = routeParams.scenario;
	$: n = routeParams.n;
	$: nError = routeParams.nError;

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

	$: effectiveN = scenarioMetadata?.requiresN ? (n ?? DEFAULT_N) : null;

	$: errorMessage = scenarioError || nError;
</script>

{#if errorMessage}
	<ErrorDisplay error={errorMessage} />
{:else if scenarioMetadata}
	<Simulation {scenario} n={effectiveN} {scenarioMetadata} />
{/if}
