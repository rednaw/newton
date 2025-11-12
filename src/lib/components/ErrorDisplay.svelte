<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import BackButton from '$lib/components/BackButton.svelte';

	export let error;

	function goHome() {
		goto(`${base}/`);
	}
</script>

<BackButton />
<div class="error-container">
	<div class="error-message">
		<h2>Error</h2>
		<p>{error}</p>
		<button class="home-link" on:click={goHome}>Return to Home</button>
	</div>
</div>

<style>
	.error-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: #111;
	}

	.error-message {
		background: #222;
		padding: 2rem;
		border-radius: 8px;
		border: 2px solid #ff4444;
		max-width: 600px;
		text-align: center;
		color: white;
	}

	.error-message h2 {
		color: #ff4444;
		margin-bottom: 1rem;
	}

	.error-message p {
		margin-bottom: 1.5rem;
		color: #ccc;
	}

	.home-link {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: #4CAF50;
		color: white;
		text-decoration: none;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 1rem;
		transition: background-color 0.2s;
	}

	.home-link:hover {
		background: #45a049;
	}
</style>

