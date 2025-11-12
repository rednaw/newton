<script>
	import BackButton from '$lib/components/BackButton.svelte';

	export let error;
</script>

<BackButton />
<div class="error-container">
	<div class="error-message">
		<h2>Error</h2>
		<p>{error}</p>
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
		margin-bottom: 0;
		color: #ccc;
	}
</style>

