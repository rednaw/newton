<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { getScenarioMetadata } from '$lib/config';
	import { parseNParam } from '$lib/utils/validation';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import BackButton from '$lib/components/BackButton.svelte';
	import SimulationConfig from '$lib/components/SimulationConfig.svelte';
	import SimulationView from '$lib/components/SimulationView.svelte';

	// Extract route parameters
	$: scenario = $page.params.scenario || 'N';
	$: pathname = browser ? $page.url.pathname : '';
	$: isSimRoute = pathname.endsWith('/sim');
	$: nParam = browser ? $page.url.searchParams.get('n') : null;
	
	// Parse and validate parameters
	$: nResult = nParam !== null ? parseNParam(nParam) : { value: null, error: null };
	$: n = nResult.value;
	$: nError = nResult.error;
	
	// Load scenario metadata
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
	
	// Handle redirect for backward compatibility (old URLs with ?n= parameter)
	let redirectHandled = false;
	
	function handleLegacyRedirect() {
		if (!browser || isSimRoute || n === null || !scenarioMetadata || scenarioError || redirectHandled) {
			return;
		}
		redirectHandled = true;
		goto(`${base}/${scenario}/sim?n=${n}`, { replaceState: true });
	}
	
	afterNavigate(() => {
		handleLegacyRedirect();
	});
	
	// Determine what to display
	$: errorMessage = scenarioError || nError;
	$: hasError = !!errorMessage;
	$: shouldShowConfig = scenarioMetadata?.requiresN && n === null && !hasError;
	$: viewMode = hasError ? 'error' : shouldShowConfig ? 'config' : 'simulation';
</script>

{#if viewMode === 'error'}
	<ErrorDisplay error={errorMessage} />
{:else if viewMode === 'config'}
	<BackButton />
	<SimulationConfig {scenario} {scenarioMetadata} />
{:else if viewMode === 'simulation'}
	<SimulationView {scenario} {n} />
{/if} 