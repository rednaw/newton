<script>
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { parseNParam } from '$lib/utils/validation';
	import SimulationView from '$lib/components/SimulationView.svelte';

	$: scenario = $page.params.scenario || 'N';
	$: nParam = browser ? $page.url.searchParams.get('n') : null;
	$: nResult = nParam !== null ? parseNParam(nParam) : { value: null, error: null };
	$: n = nResult.value;
</script>

<SimulationView {scenario} {n} />

