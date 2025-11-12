<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';

	function goHome() {
		goto(`${base}/`);
	}
</script>

<button class="back-button" on:click={goHome} aria-label="Back to home">
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
	</svg>
</button>

<style>
	.back-button {
		position: fixed;
		top: 1.5rem;
		left: 1.5rem;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: rgba(0, 0, 0, 0.6);
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		color: white;
		text-decoration: none;
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
		cursor: pointer;
		padding: 0;
		margin: 0;
	}

	.back-button:hover {
		background: rgba(0, 0, 0, 0.8);
		border-color: rgba(255, 255, 255, 0.5);
		transform: scale(1.1);
	}

	.back-button:active {
		transform: scale(0.95);
	}

	.back-button svg {
		width: 24px;
		height: 24px;
	}
</style>

