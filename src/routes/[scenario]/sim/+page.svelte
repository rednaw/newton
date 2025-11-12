<script>
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { parseRouteParams } from '$lib/utils/route-params';
	import SimulationView from '$lib/components/SimulationView.svelte';

	$: routeParams = parseRouteParams($page, browser);
	$: scenario = routeParams.scenario;
	$: n = routeParams.n;
</script>

<SimulationView {scenario} {n} />

