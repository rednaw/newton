<script>
	import { base } from '$app/paths';
</script>

<div class="landing">
	<a href={`${base}/N`} class="app-icon">
		<div class="icon">N</div>
	</a>
	<a href={`${base}/solar`} class="app-icon">
		<div class="icon solar">☉</div>
	</a>
	<a href={`${base}/E`} class="app-icon">
		<div class="icon einstein">E</div>
	</a>
	<a href={`${base}/Q`} class="app-icon">
		<div class="icon quantum">Q</div>
	</a>
</div>

<style>
	.landing {
		min-height: 100vh;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 2rem;
		padding: 2rem;
		background: linear-gradient(135deg, #111 0%, #1a1a2e 100%);
		align-content: center;
		justify-items: center;
		max-width: 600px;
		margin: 0 auto;
	}

	.app-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		transition: transform 0.15s ease;
	}

	.app-icon:active {
		transform: scale(0.9);
	}

	.icon {
		width: 80px;
		height: 80px;
		border-radius: 18px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2.5rem;
		font-weight: bold;
		color: white;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
	}

	.icon.solar {
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		font-size: 3rem;
	}

	.icon.einstein {
		background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
	}

	.icon.quantum {
		background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
	}

	@media (min-width: 600px) {
		.landing {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.landing {
			padding: 1.5rem;
			gap: 1.5rem;
		}

		.icon {
			width: 70px;
			height: 70px;
			font-size: 2rem;
		}

		.icon.solar {
			font-size: 2.5rem;
		}
	}

	@media (min-width: 1200px) {
		.landing {
			grid-template-columns: repeat(4, 1fr);
			max-width: 800px;
		}
	}
</style>
